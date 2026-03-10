import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

type Props = {
  user: { email: string; name: string }
}

WelcomeEmail.PreviewProps = {
  user: { email: "example@email.com", name: "User" },
} satisfies Props

export default function WelcomeEmail({ user }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Welcome to Better Auth</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Heading>Welcome to Better Auth</Heading>
            <Section>
              <Text className="text-[16px] leading-[26px]">
                Hi {user.name.split(" ")[0]},
              </Text>
              <Text className="text-[16px] leading-[26px]">
                Welcome to Better Auth, thank you for signing up for our app!
                We're excited to have you on board.
              </Text>
              <Section className="text-center">
                <Button
                  className="bg-[#00c72b] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
                  href="https://getkoala.com"
                >
                  Get started
                </Button>
              </Section>
              <Text className="text-[16px] leading-[26px]">
                Best regards,
                <br />
                Better Auth
              </Text>
              <Hr className="border-[#cccccc] my-5" />
              <Text className="text-[#8898aa] text-[12px]">
                470 Noor Ave STE B #1148, South San Francisco, CA 94080
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
