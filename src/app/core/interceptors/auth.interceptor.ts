import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const token = localStorage.getItem('access_token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0cnVvbmdsZWR1Y3ZpMTAwMUBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3NDI5MjY2MTMsImV4cCI6MTc0MjkyNzUxMywiaWF0IjoxNzQyOTI2NjEzLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDA0IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwNCJ9.8uOciI6zGcDcCdl_5jdaXp-5yamKn_892Sio7GMcxSQ";

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedRequest);
  }

  return next(req);
};
