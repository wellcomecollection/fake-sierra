# JSON Schemas

These are copied from the Sierra OpenAPI docs: https://sandbox.iii.com/iii/sierra-api/docs. Those docs are not quite compliant to the latest versions of the spec; so we need to update `$ref` field values to be deferencable (with a `.json` suffix), to change `id` to `$id`, to replace any mysterious `Char` refs with a string, and to remove any `T` refs.

They are used to create Typescript definitions (`yarn generate-types`) and for runtime response serialisation [via Fastify](https://www.fastify.io/docs/latest/Validation-and-Serialization/).
