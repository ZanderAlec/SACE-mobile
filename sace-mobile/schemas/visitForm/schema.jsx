import { z } from 'zod';

const numberField = (invalid_type_error = "Valor deve ser um número.", required_error = "Não pode ser vazio!") => 
    z.string()
    .refine((val) => val !== "", { message: required_error })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: invalid_type_error })
;


const enumField = (message = "Selecione um valor!") => {return {message: message}}

const treatmentObject = () => 
    z.object({
        tipo: z.enum(["Tipo A", "Tipo B", "Tipo C"]),
        forma: z.enum(["Forma A", "Forma B", "Forma C"]),
        quantidade: z.coerce.number(),
    });

export const visitSchema = z.object({
    //endereço
    idArea: z.enum(["Microregião A", "Microregião B", "Microregião C"], enumField()),
    estado: z.enum(["AL"], enumField()),
    municipio: z.enum(["Maceió"], enumField()),
    bairro: z.enum(["Ponta verde", "Benedito Bentes", "Tabuleiro"], enumField()),
    logradouro: z.string().max(40),
    
    //específicos
    numeroImovel:   z.string()
    .refine((val) => val !== "", { message: "Não pode ser vazio!" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "O valor precisa ser um número!" }),

    lado: z.enum(["ìmpar", "par"], enumField()),
    categoriaLocalidade: z.enum(["Urbana", "Rural"], enumField()),
    tipoImovel: z.enum(["Residencial"], enumField()),
    status: z.enum(["Inspecionado", "Pendente"], enumField()),
    complemento: z.string().max(50).optional(),

    //Registro de controle da dengue
    atividadesRealizadas: z.object({
        levantamentoIndice: z.boolean(),
        pontoEstrategico: z.boolean(),
        tratamento: z.boolean(),
        delimitacaoFoco: z.boolean(),
        pesquisaVetorial: z.boolean(),
    }),

    quantDepositos: z.object({
        armazenamentoElevado: z.number().min(0),
        armazenamentoAguaSolo: z.number().min(0),
        dispositivosMoveis: z.number().min(0),
        dispositivosFixos: z.number().min(0),
        pneus: z.number().min(0),
        lixos: z.number().min(0),
        naturais: z.number().min(0),
    }),

    //Coleta de amostras
    coletaAmostras: z.object({
        numeroAmostras: z.string().optional().refine((val) => {
            // If no value provided, it's valid (optional field)
            if (!val || val.trim() === "") return true;
            
            // Check format: AL-YYYY-NNN (AL-2025-032)
            const formatRegex = /^AL-\d{4}-\d{3}$/;
            return formatRegex.test(val);
        }, { message: "Formato deve ser sigla-YYYY-NNN" }),
        quantTubitos: z.string().optional(),
    }).superRefine((data, ctx) => {
        // If numeroAmostras has a value, then quantTubitos cannot be empty
        if (data.numeroAmostras && data.numeroAmostras.trim() !== "") {
            if (!data.quantTubitos || data.quantTubitos.trim() === "") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Não pode ser vazio quando número de amostras tem valor!",
                    path: ["quantTubitos"],
                });
            } else if (isNaN(Number(data.quantTubitos)) ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "O valor precisa ser um número!",
                    path: ["quantTubitos"],
                });
            } else if (isNaN(Number(data.quantTubitos)) || Number(data.quantTubitos) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "O valor precisa ser maior que 0!",
                    path: ["quantTubitos"],
                });
            }
        }
    }),
    
    //Tratamentos aplicados
    larvicida: treatmentObject(),
    // tipoLarvicida: z.string(),
    // formaLarvicida: z.string(),
    // quantidadeLarvicida: z.numbr(),
    adulticida: treatmentObject(),


    observacoes: z.string().max(100).optional(),

    //upload de arquivos

    foto: z.object({
      uri: z.string(),
      name: z.string(),
      type: z.string(),
      size: z.number(),
    }).refine(file => file.size <= 50 * 1024 * 1024, { 
        message: "A imagem deve ter no máximo 5 MB"
    })

}); 

// export type visitSchema = z.infer<typeof visitSchema>;