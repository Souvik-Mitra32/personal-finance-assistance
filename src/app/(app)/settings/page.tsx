import { getCurrentUser } from "@/lib/queries/auth"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import ChangePasswordForm from "@/components/forms/change-password-form"

export default async function SettingsPage() {
  await getCurrentUser()

  return (
    <section className="space-y-5">
      <div className="max-w-80 space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="text-gray-500">Manage your account information</div>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList variant="line">
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <div className="space-y-5">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold">Password</h2>
              <div className="text-gray-500">
                Please enter your current password to change your password.
              </div>
            </div>

            <Separator />

            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
