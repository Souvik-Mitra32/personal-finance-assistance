import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

type Props = {
  user: { email: string; name: string }
  url: string
}

PasswordResetEmail.PreviewProps = {
  user: { email: "example@email.com", name: "User" },
  url: "#",
} satisfies Props

export default function PasswordResetEmail({ user, url }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Reset password</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Heading>Reset password</Heading>
            <Section>
              <Text className="font-light text-[#404040] leading-[26px]">
                Hi {user.name},
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                Someone recently requested a password change for your Better
                Auth account. If this was you, you can set a new password here:
              </Text>
              <Button
                className="bg-[#00c72b] rounded text-white text-[15px] no-underline text-center block w-[210px] py-[14px] px-[7px]"
                href={url}
              >
                Reset password
              </Button>
              <Text className="font-light text-[#404040] leading-[26px]">
                This link will expire in 24 hours. If you don&apos;t want to
                change your password or didn&apos;t request this, just ignore
                and delete this message.
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                To keep your account secure, please don&apos;t forward this
                email to anyone. See our Help Center for{" "}
                <Link className="underline" href="#">
                  more security tips.
                </Link>
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                Happy Mastering Better Auth!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
