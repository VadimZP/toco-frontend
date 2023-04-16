import {
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useState } from "react";

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
  const [name, setName] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const [email, setEmail] = useState("");
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  async function handleAuth() {
    try {
      const data = await fetch("http://localhost:3001/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const response = await data.json();
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
    }
  }

  return (
    <Stack spacing={6} w={500} alignSelf="center" m="200px auto">
      <Input
        value={name}
        onChange={handleNameChange}
        placeholder="Enter name"
      />
      <Input
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
        Register
      </Button>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cidCookie = getCookie("connect.sid", { req, res });

  if (cidCookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { } };
};
