import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button
} from '@react-email/components'

interface verificationEmailProps {
    username: string,
    otp: string
}

export default function verificationEmail({ username, otp }: verificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>Thank Yout for registering use this code to verify your account: {otp}</Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>If you did not request this email, please contact us immediately.</Text>
                </Row>
            </Section>
        </Html>
    )
}