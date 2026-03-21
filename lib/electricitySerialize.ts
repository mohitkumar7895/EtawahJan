/** Electricity stores consumer account id in field `id`; API exposes Mongo id as `id`. */
export function serializeElectricity(
  doc: { _id: unknown; id?: string; toObject?: () => Record<string, unknown> }
) {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  const consumerId = (o as { id?: string }).id;
  const { id: _drop, ...rest } = o as Record<string, unknown>;
  return {
    ...rest,
    id: String((o as { _id?: unknown })._id ?? ''),
    consumerId: consumerId ?? '',
  };
}
