import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtected = createRouteMatcher(['/dashboard(.*)', '/history(.*)'])

export const proxy = clerkMiddleware(async (auth, req) => {
  console.log("Middleware running on:", req.url)
})

export const config = {
  matcher: ['/dashboard(.*)', '/history(.*)'],
}