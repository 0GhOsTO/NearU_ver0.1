import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';
import { supabasePublishableKey, supabaseUrl } from './config';

const protectedRoutePrefixes = [
  '/feed',
  '/marketplace',
  '/gigs',
  '/safedrop',
  '/group-ride',
  '/hangout',
  '/borrow',
  '/messages',
  '/notifications',
  '/profile',
  '/onboarding',
];

const authRoutePrefixes = ['/login', '/signup'];

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

const matchesRoutePrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const getRedirectTarget = (request: NextRequest, pathname: string) => {
  const redirectTarget = request.nextUrl.clone();
  redirectTarget.pathname = pathname;
  redirectTarget.search = '';
  return redirectTarget;
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const cookieUpdates: CookieToSet[] = [];
  const headerUpdates: Record<string, string> = {};

  const applyAuthUpdates = (target: NextResponse) => {
    cookieUpdates.forEach(({ name, value, options }) => {
      target.cookies.set(name, value, options);
    });

    Object.entries(headerUpdates).forEach(([key, value]) => {
      target.headers.set(key, value);
    });

    return target;
  };

  const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookieUpdates.push(...cookiesToSet);
        Object.assign(headerUpdates, headers);

        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = applyAuthUpdates(NextResponse.next({ request }));
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims && !error);
  const { pathname, search } = request.nextUrl;

  // Unauthenticated users cannot access protected routes
  if (!isSignedIn && matchesRoutePrefix(pathname, protectedRoutePrefixes)) {
    const redirectTarget = getRedirectTarget(request, '/login');
    redirectTarget.searchParams.set('next', `${pathname}${search}`);
    return applyAuthUpdates(NextResponse.redirect(redirectTarget));
  }

  // Authenticated users are redirected away from login/signup
  if (isSignedIn && matchesRoutePrefix(pathname, authRoutePrefixes)) {
    return applyAuthUpdates(NextResponse.redirect(getRedirectTarget(request, '/feed')));
  }

  if (isSignedIn) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isOnboarded = (data?.claims as any)?.user_metadata?.is_onboarded === true;

    // Onboarded users don't need to re-do onboarding
    if (isOnboarded && pathname === '/onboarding') {
      return applyAuthUpdates(NextResponse.redirect(getRedirectTarget(request, '/feed')));
    }

    // Non-onboarded users must complete onboarding before accessing app routes
    if (!isOnboarded && pathname !== '/onboarding' && matchesRoutePrefix(pathname, protectedRoutePrefixes)) {
      return applyAuthUpdates(NextResponse.redirect(getRedirectTarget(request, '/onboarding')));
    }
  }

  return response;
}
