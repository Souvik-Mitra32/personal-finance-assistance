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

AccountVerificationEmail.PreviewProps = {
  user: { email: "example@email.com", name: "User" },
  url: "#",
} satisfies Props

export default function AccountVerificationEmail({ user, url }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Verify your email address</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Heading>Verify your email address</Heading>
            <Section>
              <Text className="font-light text-[#404040] leading-[26px]">
                Hi {user.name},
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                Thanks for starting the new Better Auth account creation
                process. We want to make sure it's really you. Please click on
                the below button to verify your email.
              </Text>
              <Button
                className="bg-[#00c72b] rounded text-white text-[15px] no-underline text-center block w-[210px] py-[14px] px-[7px]"
                href={url}
              >
                Verify Email
              </Button>
              <Text className="font-light text-[#404040] leading-[26px]">
                This link will expire in 24 hours. If you have already verified
                your email address, just ignore and delete this message.
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                Better Auth will never email you and ask you to disclose or
                verify your password, credit card, or banking account number..
                See our Help Center for{" "}
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
