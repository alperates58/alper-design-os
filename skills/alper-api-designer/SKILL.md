---
name: alper-api-designer
description: Designs RESTful API endpoints, OpenAPI 3.1.0 specifications, standardized error envelopes, and separated authentication/authorization contracts.
---

# Alper API Designer Skill

Designs clean RESTful APIs adhering to standard HTTP semantics, pagination, error models, and OpenAPI 3.1.0 specifications.

## Pipeline Position
`DATA MODEL -> API BLUEPRINT -> OPENAPI 3.1 SPEC -> AUTH CONTRACT`

## Core Responsibilities
1. **REST Endpoint Design**:
   - Establish resource-oriented URIs (`/api/v1/{resource}`) with proper verbs (`GET`, `POST`, `PUT`, `DELETE`).
   - Standardize pagination (`page`, `pageSize`), sorting (`sortField`, `sortDirection`), and search parameters.
2. **OpenAPI 3.1.0 Specification Generation**:
   - Emit valid OpenAPI 3.1.0 documents with paths, operations, request bodies, responses, and security schemes.
3. **Standardized Response & Error Contracts**:
   - Enforce uniform envelopes (`{ success, data, error, pagination }`).
   - Define machine-readable error codes (`INVALID_INPUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`).
4. **Authentication & Authorization Separation**:
   - Keep authentication mechanism (cookies vs tokens) separate from role-based access control (RBAC).

## Associated MCP Tools
- `create_api_blueprint`: Generates full `ApiBlueprint` with endpoints, query params, and OpenAPI schema.
- `create_auth_model`: Specifies separate authentication and authorization configurations.
