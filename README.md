# fake-sierra

A (very) partial in-memory implementation of bits of the Sierra API

## Items

When requesting items (`GET /v5/items?id=comma,separated,ids`) you can choose item parameters based on the identifier:

| Item ID pattern | Location      | Status    |
| --------------- | ------------- | --------- |
| `xxxxxx0`       | Closed Stores | Available |
| `xxxxxx1`       | Open Shelves  | Available |
| [default]       | Closed Stores | Available |
