import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

type Props = {
  user: { email: string; name: string }
  url: string
}

AccountDeleteConfirmationEmail.PreviewProps = {
  user: { email: "example@email.com", name: "User" },
  url: "#",
} satisfies Props

export default function AccountDeleteConfirmationEmail({ user, url }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Delete Account</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Heading>Delete Account</Heading>
            <Section>
              <Text className="font-light text-[#404040] leading-[26px]">
                Hi {user.name},
              </Text>
              <Text className="text-[16px] leading-[26px]">
                We're sorry to see you go! Please confirm your account deletion
                by clicking the button below:
              </Text>
              <Section className="text-center">
                <Button
                  className="bg-[#00c72b] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
                  href={url}
                >
                  Confirm delete
                </Button>
              </Section>
              <Text className="text-[16px] leading-[26px]">
                This link will expire in 24 hours. If you don't have an account,
                please ignore this email.
              </Text>
              <Text className="text-[16px] leading-[26px]">
                Best regards,
                <br />
                Better Auth
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
