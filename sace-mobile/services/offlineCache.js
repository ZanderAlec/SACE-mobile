import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { registersApi } from './api';

const QUEUE_KEY = '@offline_queue';
const MAX_RETRIES = 3;

class OfflineCacheService {
    constructor() {
        this.isOnline = true;
        this.isProcessing = false;
        this.networkUnsubscribe = null;
        this.init();
    }

    async init() {
        // Check initial network state
        const state = await NetInfo.fetch();
        this.isOnline = state.isConnected && state.isInternetReachable !== false;
        
        // Subscribe to network state changes
        this.networkUnsubscribe = NetInfo.addEventListener(state => {
            const wasOffline = !this.isOnline;
            this.isOnline = state.isConnected && state.isInternetReachable !== false;
            
            // If we just came back online, process the queue
            if (wasOffline && this.isOnline) {
                console.log('Network connection restored, processing queued operations...');
                this.processQueue();
            }
        });

        // Process any existing queue on init
        if (this.isOnline) {
            this.processQueue();
        }
    }

    /**
     * Check if device is online
     */
    isConnected() {
        return this.isOnline;
    }

    /**
     * Add an operation to the offline queue
     */
    async queueOperation(operation) {
        try {
            const queue = await this.getQueue();
            
            // Prepare operation data - remove files since they can't be serialized
            const operationData = {
                ...operation,
                data: { ...operation.data }
            };
            
            // Remove files from data since they can't be serialized to JSON
            if (operationData.data.files) {
                // Store file metadata for reference (but not the actual file objects)
                operationData.data._filesMetadata = operationData.data.files.map(file => ({
                    name: file.name,
                    type: file.type,
                    uri: file.uri // Store URI as string, but it may not be accessible later
                }));
                delete operationData.data.files;
            }
            
            const operationWithId = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                retries: 0,
                ...operationData
            };
            
            queue.push(operationWithId);
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
            console.log('Operation queued:', operationWithId.id, operation.type);
            return operationWithId.id;
        } catch (error) {
            console.error('Error queueing operation:', error);
            throw error;
        }
    }

    /**
     * Get the current queue from storage
     */
    async getQueue() {
        try {
            const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
            return queueJson ? JSON.parse(queueJson) : [];
        } catch (error) {
            console.error('Error getting queue:', error);
            return [];
        }
    }

    /**
     * Remove an operation from the queue
     */
    async removeOperation(operationId) {
        try {
            const queue = await this.getQueue();
            const filtered = queue.filter(op => op.id !== operationId);
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
            console.log('Operation removed from queue:', operationId);
        } catch (error) {
            console.error('Error removing operation:', error);
        }
    }

    /**
     * Process all queued operations
     */
    async processQueue() {
        if (this.isProcessing || !this.isOnline) {
            return;
        }

        this.isProcessing = true;
        const queue = await this.getQueue();

        if (queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        console.log(`Processing ${queue.length} queued operations...`);

        for (const operation of queue) {
            if (!this.isOnline) {
                console.log('Lost connection while processing queue, stopping...');
                break;
            }

            try {
                await this.executeOperation(operation);
                // Remove successful operation from queue
                await this.removeOperation(operation.id);
            } catch (error) {
                console.error('Error executing queued operation:', error);
                
                // Increment retry count
                operation.retries = (operation.retries || 0) + 1;

                if (operation.retries >= MAX_RETRIES) {
                    console.log('Operation exceeded max retries, removing from queue:', operation.id);
                    await this.removeOperation(operation.id);
                } else {
                    // Update the operation in the queue with new retry count
                    const updatedQueue = await this.getQueue();
                    const index = updatedQueue.findIndex(op => op.id === operation.id);
                    if (index !== -1) {
                        updatedQueue[index] = operation;
                        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
                    }
                }
            }
        }

        this.isProcessing = false;
    }

    /**
     * Execute a queued operation
     */
    async executeOperation(operation) {
        const { type, data, registroId } = operation;

        if (type === 'CREATE_REGISTER') {
            // Reconstruct FormData from stored data
            const formData = this.reconstructFormData(data);
            await registersApi.createRegister(formData);
            console.log('Successfully executed queued CREATE_REGISTER');
        } else if (type === 'UPDATE_REGISTER') {
            // Reconstruct FormData from stored data
            const formData = this.reconstructFormData(data);
            await registersApi.updateRegister(registroId, formData);
            console.log('Successfully executed queued UPDATE_REGISTER');
        } else {
            throw new Error(`Unknown operation type: ${type}`);
        }
    }

    /**
     * Reconstruct FormData from stored JSON data
     * Note: Files cannot be serialized to JSON, so they will be lost when queued
     * This is acceptable for offline scenarios - the form data will still be saved
     */
    reconstructFormData(storedData) {
        // Return the data as-is since we stored the original formData object
        // The API functions will convert it to FormData when sending
        // Files array will be empty/undefined, which is fine for offline retries
        const reconstructed = { ...storedData };
        // Remove files since they can't be serialized
        if (reconstructed.files) {
            delete reconstructed.files;
        }
        return reconstructed;
    }

    /**
     * Get queue status for UI display
     */
    async getQueueStatus() {
        const queue = await this.getQueue();
        return {
            count: queue.length,
            operations: queue.map(op => ({
                id: op.id,
                type: op.type,
                timestamp: op.timestamp,
                retries: op.retries || 0
            }))
        };
    }

    /**
     * Clear the entire queue (use with caution)
     */
    async clearQueue() {
        try {
            await AsyncStorage.removeItem(QUEUE_KEY);
            console.log('Queue cleared');
        } catch (error) {
            console.error('Error clearing queue:', error);
        }
    }

    /**
     * Cleanup - unsubscribe from network events
     */
    cleanup() {
        if (this.networkUnsubscribe) {
            this.networkUnsubscribe();
            this.networkUnsubscribe = null;
        }
    }
}

// Export singleton instance
const offlineCache = new OfflineCacheService();
export default offlineCache;

