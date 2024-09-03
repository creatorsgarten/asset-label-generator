# asset-label-generator

Generates asset labels.

## Usage

```sh
# Install dependencies
pnpm install

# Run server
pnpm dev
```

- Go the home page and select the template to print.

- Append the following URL parameters.

  | Parameter  | Applies to     | Description                     | Example   |
    | ---------- | -------------- | ------------------------------- | --------- |
  | `id`       | All templates  | The ID to print on the label.   | `CG00000` |
  | `diameter` | Flag templates | The diameter of the flag in mm. | `10`      |

- Drag the generated image to a folder to save it.
