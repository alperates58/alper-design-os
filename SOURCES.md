# External Catalogs & Discovery Sources

## Policy
In accordance with Phase 0 architectural constraints, external open-source repositories are **not copied in bulk** into this repository. Instead, Alper Design OS maintains a lightweight, normalized index for automated tool discovery.

---

## 1. Public APIs Discovery Catalog
- **Upstream Repository**: [`public-apis/public-apis`](https://github.com/public-apis/public-apis)
- **Local Index Path**: `sources/apis/catalog.json`
- **Purpose**: Enables the Design OS to identify existing real-world APIs and data sources (weather, currencies, sensors, logistics, geographical data) during the `NEW` mode architecture phase.
- **Normalization Schema**: Defined in `sources/schema.ts` (`CatalogItemSchema`).

---

## 2. Awesome MCP Servers Discovery Catalog
- **Upstream Repository**: [`punkpeye/awesome-mcp-servers`](https://github.com/punkpeye/awesome-mcp-servers)
- **Local Index Path**: `sources/mcp/catalog.json`
- **Purpose**: Enables the Design OS to discover and recommend complementary Model Context Protocol servers (GitHub, PostgreSQL, Filesystem, Docker, Memory Graph) to augment workspace tools.
- **Normalization Schema**: Defined in `sources/schema.ts` (`CatalogItemSchema`).

---

## Synchronization Guidelines
1. Do not copy upstream git history or unrelated markdown files into the repository.
2. Index updates are performed periodically using normalization scripts that parse upstream lists into `sources/<catalog>/catalog.json`.
3. Every catalog item must specify verified license information and commercial usability flags.
