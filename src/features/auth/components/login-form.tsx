import { Formik } from 'formik'
import * as Yup from 'yup'
import { useLogin } from '../hooks/useAuthMutation'
import { cn } from '@/core/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

export const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const login = useLogin()
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={SigninSchema}
            onSubmit={(values) => {
              login.mutate(values)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        aria-invalid={!!(errors.email && touched.email)}
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="********"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        aria-invalid={!!(errors.password && touched.password)}
                      />
                      {errors.password && touched.password && (
                        <div className="text-red-500 text-sm">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={login.isPending}
                    >
                      {login.isPending ? 'Processing...' : 'Login'}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
