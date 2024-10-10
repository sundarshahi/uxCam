import BSONObjectID from "bson-objectid";

export default function objectId(): string {
  return new BSONObjectID().toString();
}
