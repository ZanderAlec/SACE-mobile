import { z } from 'zod';

const numberField = (invalid_type_error = "Valor deve ser um número.") => 
     z.coerce.number({invalid_type_error: invalid_type_error}).optional();

const numberFieldRequired = (required_error = "Não pode ser vazio!", invalid_type_error = "Valor deve ser um número.") => 
    z.preprocess( (val) => (val === "" || val === null  ? undefined : Number(val)) , 
        z.number({required_error: required_error, invalid_type_error: invalid_type_error})
    );

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
    numeroImovel: numberFieldRequired(),

    lado: z.enum(["ìmpar", "par"], enumField()),
    categoriaLocalidade: z.enum(["Urbana", "Rural"], enumField()),
    tipoImovel: z.enum(["Residencial"], enumField()),
    status: z.enum(["Inspecionado", "Pendente"], enumField()),
    complemento: z.string().max(50).optional(),

    //Registro de controle da dengue
    atividadesRealizadas: z.enum(["LI - Levantamento de Índice", "PE - Ponto estratégico", "T - Tratamento", "DF - Delimitação de foco", "PVE - Pesquisa Vetorial Especial"]),

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
    numeroAmostra: z.string().optional(),
    quantTubitos: numberField(),
    
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