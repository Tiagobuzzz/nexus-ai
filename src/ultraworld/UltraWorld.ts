export interface Message {
  sender: string
  receiver: string
  content: string
  method: string
  delayDays: number
  delivered: boolean
  encoded?: boolean
}

export interface Rumor {
  origin: string
  content: string
  distortionLevel: number
  spreaders: string[]
}

export interface InterceptedMessage {
  target: string
  spyAgent: string
  interceptType: 'Bloqueio' | 'Leitura' | 'Alteracao'
  originalMessage: string
  modifiedMessage?: string
}

export interface WarEvent {
  cause: string
  started: boolean
}

export class CommunicationNetworkSystem {
  messages: Message[] = []

  sendMessage(
    sender: string,
    receiver: string,
    content: string,
    method: string,
    delayDays: number,
    encoded = false
  ) {
    if (encoded) {
      content = Buffer.from(content).toString('base64')
    }

    this.messages.push({
      sender,
      receiver,
      content,
      method,
      delayDays,
      delivered: false,
      encoded,
    })
    console.log(
      `\u{1F4E8} Mensagem de ${sender} para ${receiver} via ${method} | Chegara em ${delayDays} dias`
    )
  }

  progressTime(daysPassed: number) {
    for (const msg of this.messages) {
      if (!msg.delivered && daysPassed >= msg.delayDays) {
        msg.delivered = true
        const content = msg.encoded
          ? Buffer.from(msg.content, 'base64').toString('utf8')
          : msg.content
        console.log(`\u{2705} Mensagem entregue: '${content}' para ${msg.receiver}`)
      }
    }
  }
}

export class RumorSystem {
  rumors: Rumor[] = []

  createRumor(origin: string, content: string, distortion: number) {
    const rumor: Rumor = {
      origin,
      content,
      distortionLevel: distortion,
      spreaders: [],
    }
    this.rumors.push(rumor)
    console.log(
      `\u{1F5E3} Rumor iniciado por ${origin} | Nivel de distorcao: ${distortion.toFixed(
        2
      )}`
    )
    return rumor
  }

  spreadRumor(spreader: string, rumor: Rumor) {
    rumor.spreaders.push(spreader)
    rumor.distortionLevel += 0.05
    if (rumor.distortionLevel > 1) rumor.distortionLevel = 1
    console.log(
      `\u{1F4E1} ${spreader} espalhou o rumor: '${rumor.content}' | Novo nivel de distorcao: ${rumor.distortionLevel.toFixed(
        2
      )}`
    )
  }
}

export class InformationInterceptSystem {
  intercepts: InterceptedMessage[] = []

  intercept(
    target: string,
    spy: string,
    type: 'Bloqueio' | 'Leitura' | 'Alteracao',
    original: string,
    modified = ''
  ) {
    this.intercepts.push({
      target,
      spyAgent: spy,
      interceptType: type,
      originalMessage: original,
      modifiedMessage: modified,
    })
    console.log(
      `\u{1F575} Interceptacao por ${spy} | Alvo: ${target} | Tipo: ${type}`
    )
    if (type === 'Alteracao')
      console.log(`\u{1F4C9} Mensagem original: '${original}' -> Alterada: '${modified}'`)
  }
}

export class HistorySystem {
  wars: WarEvent[] = []

  logWar(cause: string) {
    this.wars.push({ cause, started: true })
    console.log(`\u{1F4A3} Guerra iniciada devido a: ${cause}`)
  }
}

export class ReactionAI {
  constructor(
    private comm: CommunicationNetworkSystem,
    private rumors: RumorSystem,
    private intercepts: InformationInterceptSystem,
    private history: HistorySystem
  ) {}

  evaluate() {
    for (const msg of this.comm.messages) {
      if (!msg.delivered && msg.delayDays > 5) {
        console.log(
          `\u{1F916} Alerta: mensagem de ${msg.sender} para ${msg.receiver} atrasada.`
        )
      }
    }

    for (const rumor of this.rumors.rumors) {
      if (rumor.distortionLevel >= 0.8) {
        console.log(`\u{1F916} Rumor perigoso detectado: '${rumor.content}'`)
        if (rumor.spreaders.length > 3) {
          this.history.logWar(rumor.content)
        }
      }
    }

    for (const intercept of this.intercepts.intercepts) {
      if (intercept.interceptType === 'Alteracao') {
        console.log(
          `\u{1F916} Suspeita de sabotagem em mensagem para ${intercept.target}`
        )
      }
    }
  }
}

// Example of additional methods with preset delays
export const Methods = {
  Voz: 0,
  Carta: 3,
  Pombo: 2,
  RedeMagica: 1,
  TerminalTecnologico: 0,
  CorreioEstatal: 2,
  EcoMental: 0,
  RedeReligiosa: 2,
  LinguagemCodificada: 4,
} as const

