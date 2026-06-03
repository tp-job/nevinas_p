# Design System: Colors

## Soft Pastel Palette (UI & Gauges)
| Name | Hex | CSS Variable | Usage |
| :--- | :--- | :--- | :--- |
| Pastel Green | `#6FD195` | `--color-pastel-green` | Success, Active stats |
| Pastel Blue | `#6B9FE8` | `--color-pastel-blue` | Primary buttons, Links |
| Pastel Purple| `#B18FE8` | `--color-pastel-purple` | Highlights, Accents |
| Pastel Yellow| `#F4C542` | `--color-pastel-yellow` | Warnings, Tags |

## Depth & Surface (Parallax Layers)
To create the parallax effect, we use a tiered background system:

### Light Mode
- **Base Layer:** `#f8fafc` (Slate 50)
- **Floating Card:** `#ffffff` (White with 80% opacity for glass effect)
- **Border:** `rgba(226, 232, 240, 0.6)`

### Dark Mode
- **Deep Layer:** `#13141B` (Matte Midnight)
- **Surface Layer:** `#1E202C` (Velvet Night)
- **Glass Surface:** `rgba(30, 32, 44, 0.8)`

*Note: Use `backdrop-filter: blur(16px)` on all floating layers to enhance depth.*