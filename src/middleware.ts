/* eslint-disable unused-imports/no-unused-vars */
import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface TokenPayload {
  id: number;
  username: string;
  roles: string[];
  exp: number; // Token expiration timestamp
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Get the pathname from the request URL
  const { pathname } = request.nextUrl;

  // Define public routes that do not require authentication
  const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password'];

  // If the request is for a public route
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        // // Verify and decode the token
        // const decodedToken = jwtDecode<TokenPayload>(token);
        // // Check if the token is expired
        // const currentTime = Math.floor(Date.now() / 1000);
        // if (decodedToken.exp < currentTime) {
        //   // Token is expired, allow access to public route
        //   return NextResponse.next();
        // }
        if (true) {
          // Token is expired, allow access to public route
          return NextResponse.next();
        }

        // Token is valid, redirect authenticated user to organization services
        return NextResponse.redirect(new URL('/', request.url));
        // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (error) {
        // Invalid token, allow access to public route
        return NextResponse.next();
      }
    } else {
      // No token, allow access to public route
      return NextResponse.next();
    }
  }

  // For protected routes, check authentication
  if (!token) {
    // No token, redirect to sign-in page
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    // Verify and decode the token
    const decodedToken = jwtDecode<TokenPayload>(token);
    // console.log('decodedToken', decodedToken);

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // Token is expired, redirect to sign-in page
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Check if the user is authorized for the service
    const segments = pathname.split('/');
    const service = segments[1];

    // if (!isAuthorizedForOrganization(service)) {
    //   // User is not authorized for this service
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }

    // Check roles (e.g., for admin routes)
    const userRoles = decodedToken.roles;
    if (pathname.startsWith('/admin') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Token is valid and user is authorized, proceed to the requested route
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to sign-in page
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

function isAuthorizedForOrganization(organization: string) {
  const userOrganizations = [
    'recipe-catalog',
    'recipe-detail',
    'recipe-editor',
    'performance_management',
    'recipe-editor',
  ];

  return userOrganizations.includes(organization);
}

// Middleware configuration to exclude specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
