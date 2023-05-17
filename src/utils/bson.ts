import { BSON } from 'bson'
import { RawData } from 'ws'

export const serializeBson = (object: BSON.Document, options?: BSON.SerializeOptions): Uint8Array =>
	BSON.serialize(object, options)

export const deserializeBson = <T= BSON.Document>(buffer: RawData, options?: BSON.DeserializeOptions | undefined): T =>
	BSON.deserialize(Buffer.from(buffer as ArrayBuffer), options) as T
