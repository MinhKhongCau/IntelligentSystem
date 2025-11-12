# Common Components

This directory contains reusable components that can be used across the application.

## ImageUploader

A reusable component for uploading and managing images.

### Features
- Image file selection with drag-and-drop UI
- File validation (type and size)
- Image preview before upload
- Upload progress indicator
- Error handling
- Edit/Cancel functionality

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentImage` | string | No | URL or path of the current image to display |
| `onImageUpdate` | function | Yes | Callback function called when image is successfully uploaded. Receives the new image URL as parameter |
| `className` | string | No | Additional CSS classes to apply to the container |

### Usage Example

```jsx
import ImageUploader from '../../common/ImageUploader';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpdate = (newImageUrl) => {
    setImageUrl(newImageUrl);
    // You can also update your form data here
  };

  return (
    <ImageUploader 
      currentImage={imageUrl}
      onImageUpdate={handleImageUpdate}
      className="mb-8"
    />
  );
}
```

### API Requirements

The component expects a backend endpoint at `/api/upload/image` that:
- Accepts POST requests with `multipart/form-data`
- Receives the image file in a field named `image`
- Returns a JSON response with the image URL in one of these formats:
  - `{ url: "..." }`
  - `{ imageUrl: "..." }`
  - Or the URL as a direct string response

### File Constraints
- Maximum file size: 5MB
- Accepted formats: All image types (image/*)
- Validation is performed client-side before upload
