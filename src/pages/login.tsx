import {
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

function PasswordInput({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        onChange={onChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default function Auth() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  async function handleAuth() {
    try {
      const data = await fetch("http://localhost:3001/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const status = data.status;
      if (status === 200) {
        router.replace("http://localhost:3000/");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
    }
  }

  return (
    <Stack spacing={6} w={500} alignSelf="center" m="200px auto">
      <Input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
      />
      <PasswordInput onChange={handlePasswordChange} />
      <Button
        w={250}
        colorScheme="teal"
        size="md"
        alignSelf="center"
        onClick={handleAuth}
      >
        Login
      </Button>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cidCookie = getCookie("connect.sid", { req, res });

  if (cidCookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
