export const domainEvents = {
	notificationCreated: "NotificationCreatedDomainEvent",
	notificationReaded: "NotificationReadedDomainEvent"
}

export type DomainEvent = {
	id: string
	aggregateId: string
	metadata: never
}

export type NotificationCreatedDomainEvent = {
	userId: string
} & DomainEvent

export type NotificationReadedDomainEvent = {
	userId: string
} & DomainEvent


