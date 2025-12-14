# Online Gallery API

REST API for uploading, viewing, and deleting images using Cloudinary, with authentication via Auth0.

---

## Modules

| Module        | Description                                         |
|---------------|-----------------------------------------------------|
| Auth          | JWT authentication via Auth0, endpoint protection  |
| Images        | Uploading, viewing, and deleting images            |
| Cloudinary    | Cloudinary integration for file storage            |

---

## Entity & Data Flow

### Database (SQLite)

| Image      |
|------------|
| id         |
| url        |
| publicId   |
| filename   |
| uploadedAt |

---

### External Service (Cloudinary)

Images are stored in the cloud via Cloudinary API.  

- **Upload:** via `POST /images`  
- **Delete:** via `DELETE /images/:id`  
- **Fetch list:** via `GET /images` with pagination  

---

## Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| Guarded via Auth0 JWT | N/A | Used to protect endpoints (with `@UseGuards(AuthGuard)`) |

#### Images
| Method | Endpoint           | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/images`          | Upload a new image                           |
| GET    | `/images`          | Retrieve images list with pagination         |
| DELETE | `/images/:id`      | Delete an image by ID (HTTP 204 No Content) |
