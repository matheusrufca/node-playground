import { BSON } from 'bson'

export const serializeBson = (object: BSON.Document, options?: BSON.SerializeOptions): Uint8Array =>
	BSON.serialize(object, options)

export const deserializeBson = (buffer: Uint8Array, options?: BSON.DeserializeOptions | undefined): BSON.Document =>
	BSON.deserialize(buffer, options)