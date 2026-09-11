

export type Lang = 'es' | 'en' | 'pt-BR';

export const TRACE_MESSAGES: Record<number, Record<Lang, string>> = {
    //for founded data
    2000: {
        es: 'Datos obtenidos con exíto.',
        en: 'Data successfully obtained.',
        'pt-BR': 'Dados obtidos com sucesso.'
    },
    2001: {
        es: '¡Este email está disponible!. Sigamos con la creación de tu tienda.',
        en: "This email is available! Let's continue with the creation of your store.",
        'pt-BR': 'Este e-mail está disponível! Vamos continuar com a criação da sua loja.'
    },
    2010: {
        es: 'Registro creado correctamente',
        en: 'Record created successfully',
        'pt-BR': 'Registro criado com sucesso.'
    },
    2011: {
        es: 'Tu código va en camino. Puede tardar unos minutitos en llegar.',
        en: 'Your code is on its way. It may take a few minutes to arrive.',
        'pt-BR': 'Seu código está a caminho. Pode levar alguns minutos para chegar..'
    },
    4000: {
        es: 'Faltan campos obligatorios. Revisa la información e intenta de nuevo.',
        en: 'Some required fields are missing. Please review and try again.',
        'pt-BR': 'Faltam campos obrigatórios. Revise e tente novamente.',
    },
    4001: {
        es: '!Qué coincidencia!, Alguien ya usa este correo.',
        en: 'What a coincidence! Someone is already using this email address.',
        'pt-BR': 'Que coincidência! Alguém já está usando este endereço de e-mail.',
    },
    4002: {
        es: 'Ese código no parece ser el correcto.',
        en: "That code doesn't seem to be the correct one.",
        'pt-BR': 'Esse código parece não ser o correto.',
    },
    4003: {
        es: '!Qué coincidencia!, Alguien ya usa este nombre de negocio.',
        en: "What a coincidence! Someone is already using this business name.",
        'pt-BR': 'Que coincidência! Alguém já está usando esse nome comercial.',
    },
    4004: {
        es: 'Pero primero debes abrir la caja para continuar.',
        en: "But first you need to open the box to continue.",
        'pt-BR': 'Mas primeiro você precisa abrir a caixa para continuar.',
    },
    4005: {
        es: '!Qué coincidencia!, este proveedor ya existe.',
        en: "What a coincidence! This supplier already exists.",
        'pt-BR': 'Que coincidência! Esse fornecedor já existe.',
    },
    4006: {
        es: 'Ya tienes un borrador en marcha, termínalo para que puedas crear el siguiente.',
        en: "You already have a draft in progress, finish it so you can create the next one.",
        'pt-BR': 'Você já tem um rascunho em andamento, termine-o para que possa criar o próximo.',
    },
    4007: {
      es: "Empleado no disponible en esta sede, Revisa la ubicación e intenta de nuevo.",
      en: "Employee not available at this location. Please check the location and try again.",
      'pt-BR': "Não há funcionário disponível neste local. Verifique a localização e tente novamente."
    },
    4008: {
      es: "Esta caja ya turno en curso. Cierra el turno actual para poder abrir uno nuevo.",
      en: "This register is already in session. Close the current session to open a new one.",
      'pt-BR': "Este cadastro já está em sessão. Feche a sessão atual para abrir uma nova."
    },
    4009: {
        es: "Solo falta configurar el horario de hoy para esta sede.",
        en: "We just need to set today's schedule for this location.",
        'pt-BR': "Precisamos apenas definir a programação de hoje para este local.."
    },
    40010: {
        es: "Parece que estamos fuera de horario. Por ahora no es posible abrir un turno.",
        en: "It appears we are outside of business hours. It is not possible to schedule a shift at this time.",
        'pt-BR': "Parece que estamos fora do horário comercial. Não é possível agendar um turno neste momento."
    },
    40011: {
      es: "Este código ya caducó o no es el correcto. ¿Pedimos uno nuevo?",
      en: "This code has expired or is incorrect. Should we request a new one?",
      "pt-BR": "Este código expirou ou está incorreto. Devemos solicitar um novo?"
    },
    40012: {
      es: "Llegaste un poquito tarde, este enlace ya expiró, pero no te preocupes, puedes pedir otro",
      en: "You're a little late, this link has already expired, but don't worry, you can request another one.",
      "pt-BR": "Você chegou um pouco tarde, este link já expirou, mas não se preocupe, você pode solicitar outro."
    },
    40013: {
      es: "Parece que Llegaste al limite de tu plan, si no es así contacta soporte tecnico y con gusto te atenderemos",
      en: "It appears you've reached your plan limit. If this isn't the case, please contact technical support and we'll be happy to assist you..",
      "pt-BR": "Parece que você atingiu o limite do seu plano. Caso contrário, entre em contato com o suporte técnico e teremos prazer em ajudá-lo.."
    },
    40014: {
        es: 'Ya tienes este plan activo. 🌟 Actualmente estás disfrutando de todos sus beneficios, así que no necesitas hacer nada más. ¡A seguir vendiendo!',
        en: 'You’re already on this plan. 🌟 You’re all set with these benefits, so there’s nothing else you need to do. Let’s keep those sales coming!.',
        'pt-BR': 'Você já está com este plano ativo. 🌟 No momento, você já aproveita todos os benefícios, então não precisa fazer mais nada. Bora vender!.',
    },
    //UnAuthorizate
    4010: {
        es: "Parece que no tienes permiso para entrar a esta sección todavía.",
        en: "It appears you are not yet allowed to enter this section.",
        'pt-BR': "Parece que você ainda não tem permissão para acessar esta seção.",
    },
    4011: {
        es: "Los datos no coinciden. Dale una revisada al correo y la contraseña.",
        en: "The information doesn't match. Please double-check your email and password.",
        'pt-BR': "Parece que você ainda não tem permissão para acessar esta seção.",
    },
    4012: {
        es: 'La cuenta de este negocio se encuentra desactivada,\n por favor contacta al administrador.',
        en: 'This business account is currently deactivated.\n Please contact the administrator..',
        'pt-BR': 'Esta conta comercial está temporariamente desativada.\n Por favor, entre em contato com o administrador..',
    },
    4040: {
      es: "Parece que nos perdimos. No pudimos encontrar lo que buscabas.",
      en: "Looks like we got lost. We couldn't find what you were looking for.",
      'pt-BR': "Parece que nos perdemos. Não conseguimos encontrar o que você estava procurando."
    },
    4041: {
      es: "Caja no disponible en esta sede, Revisa la ubicación e intenta de nuevo.",
      en: "Cashier not available at this location. Please check the location and try again.",
      'pt-BR': "Não há caixa disponível neste local. Por favor, verifique a localização e tente novamente."
    },
    4042: {
      es: "Parece que este turno ya no está disponible. Verifica e intenta de nuevo",
      en: "It appears this shift is no longer available. Please check and try again",
      'pt-BR': "Parece que este turno não está mais disponível. Por favor, verifique e tente novamente"
    },
    4043: {
      es: "Ya existe una secuencia configurada para este tipo de documento.",
      en: "A sequence is already configured for this type of document.",
      'pt-BR': "Já existe uma sequência configurada para este tipo de documento."
    },
    4044: {
      es: "Debes de ingresar la información de envió.",
      en: "You must enter the shipping information.",
      'pt-BR': "Deve inserir as informações de envio.."
    },
    //for register data
    5000: {
        es: 'Por favor, vuelve a intentarlo más tarde.',
        en: 'Please try again later.',
        'pt-BR': 'Por favor, tente novamente mais tarde.',
    },
    5001: {
        es: 'Por favor, vuelve a intentarlo más tarde.',
        en: 'Please try again later.',
        'pt-BR': 'Por favor, tente novamente mais tarde.',
    },
    5002: {
        es: 'Este registro ya se encuentra en uso. Por favor, verifica los datos e intenta de nuevo.',
        en: 'This record is already in use. Please verify the information and try again.',
        'pt-BR': 'Este registro já está em uso. Por favor, verifique as informações e tente novamente.',
    }
};