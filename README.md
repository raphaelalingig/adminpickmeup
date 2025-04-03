# PickMeUp - Admin Web Application (React.js)

This repository contains the React.js admin web application for managing the PickMeUp platform.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Jundy25/adminpickmeup.git
cd adminpickmeup
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following contents:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The admin panel will be accessible at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be stored in the `build` directory. You can deploy these files to any static hosting service.

## Admin Credentials

### Default Superadmin User
- Email: `superadmin@gmail.com`
- Password: `!superadmin_123!`

### Default Admin User
- Email: `admin@gmail.com`
- Password: `!admin_123!`

## Environment Variables

The following environment variables can be configured in your `.env` file:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_SOCKET_URL=http://localhost:8000
REACT_APP_VERSION=$npm_package_version
```

## Features

The admin panel includes the following features:
- User management
- Driver management
- Ride tracking and monitoring
- Analytics and reporting
- System configuration

## Authentication

The admin panel uses JWT authentication. The token is stored in local storage and automatically included in API requests.

## Google Maps Integration

This application uses Google Maps for location tracking and visualization. To set up Google Maps:

1. Obtain a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the necessary APIs in your Google Cloud project
3. Add your API key to the `.env` file as shown above

## Customization

### Theme Configuration

The theme settings can be modified in `src/theme/index.js`.

### Logo and Branding

To update the logo and branding:
1. Replace the logo files in the `public` directory
2. Update the branding colors in the theme configuration

## Troubleshooting

- If you encounter CORS issues, ensure your backend API has the correct CORS headers enabled.
- For authentication issues, check that your API URL is correct and the backend server is running.
- If components fail to load, check the browser console for errors and ensure all dependencies are installed.

## Browser Support

The admin panel is optimized for the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material-UI Documentation](https://mui.com/getting-started/installation/)
