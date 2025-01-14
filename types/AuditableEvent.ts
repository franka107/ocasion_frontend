export enum AuditableEvent {
  BidCounterOfferMade = 'BID_COUNTER_OFFER_MADE',
  BidAccepted = 'BID_ACCEPTED',
  BidRejected = 'BID_REJECTED',
  BidDiscarded = 'BID_DISCARDED',
  BidCreated = 'BID_CREATED',
  BidCancelled = 'BID_CANCELLED',
}

export type AuditableEventBidCounterOfferMade = {
  event: AuditableEvent.BidCounterOfferMade
  payload: {
    bidCurrentAmount: number
    bidRequestedAmount: number
  }
}

export type AuditableEventBidRejected = {
  event: AuditableEvent.BidRejected
  payload: {
    motive: 'expiration' | 'rejection'
  }
}

export type AuditableEventBidAccepted = {
  event: AuditableEvent.BidAccepted
  payload: {}
}
export enum ExecutorSource {
  User = 'USER',
  System = 'SYSTEM',
}

export enum BidRejectedMotive {
  Expiration = 'EXPIRATION',
  Unknown = 'UNKNOWN',
  ExpirationRetryToNext = 'EXPIRATION_RETRY_TO_NEXT',
}

export const bidRejectedMotiveRecord: Record<
  BidRejectedMotive,
  { label: string }
> = {
  [BidRejectedMotive.Expiration]: {
    label:
      'El participante no tomo acción en el tiempo establecido de la contraoferta',
  },
  [BidRejectedMotive.ExpirationRetryToNext]: {
    label:
      'El participante no tomo acción en el tiempo establecido de la contraoferta, reintentando el proceso a la siguiente puja',
  },
  [BidRejectedMotive.Unknown]: {
    label: 'No hay motivo establecido',
  },
}

export const auditableEventRecord: Record<AuditableEvent, { label: string }> = {
  [AuditableEvent.BidCounterOfferMade]: {
    label: 'Puja Contraofertada',
  },
  [AuditableEvent.BidCancelled]: {
    label: 'Puja Cancelada',
  },
  [AuditableEvent.BidAccepted]: {
    label: 'Puja Aceptada',
  },
  [AuditableEvent.BidRejected]: {
    label: 'Puja Rechazada',
  },
  [AuditableEvent.BidCreated]: {
    label: 'Puja creada',
  },
  [AuditableEvent.BidDiscarded]: {
    label: 'Puja Descartada',
  },
}

export const executorRecord: Record<ExecutorSource, { label: string }> = {
  [ExecutorSource.User]: {
    label: 'Usuario',
  },
  [ExecutorSource.System]: {
    label: 'Sistema',
  },
}

export type AuditableEventSealed = (
  | AuditableEventBidCounterOfferMade
  | AuditableEventBidAccepted
  | AuditableEventBidRejected
) & { payload: { executor: any } }

export type AuditableEventDto = {
  /** Stream ID al que pertenece el evento */
  streamId: string

  /** Versión del evento dentro del stream */
  version: number

  /** Nombre del evento ocurrido */
  event: AuditableEvent

  /** Payload del evento en formato JSON */
  payload: Record<string, any>

  /** ID único del evento */
  eventId: string

  /** ID del agregado relacionado al evento */
  aggregateId: string

  /** Fecha y hora en la que ocurrió el evento */
  occurredOn: Date

  /** ID de correlación para rastrear una solicitud */
  correlationId: string | null

  /** ID de causa para rastrear la relación entre eventos */
  causationId: string | null
}
