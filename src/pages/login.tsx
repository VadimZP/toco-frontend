import {
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { MdOutlineAlternateEmail } from "react-icons/md";
import UserContext from "@/contexts/UserContext";

interface PasswordInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  passwordErrorMessage: string;
}

function PasswordInput({
  onChange,
  onBlur,
  passwordErrorMessage,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={!!passwordErrorMessage}>
      <FormLabel htmlFor="passwordInput">Password</FormLabel>
      <InputGroup size="md">
        <Input
          id="passwordInput"
          name="password"
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={onChange}
          onBlur={onBlur}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
    </FormControl>
  );
}

export function validateEmail(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export default function Auth() {
  const router = useRouter();

  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });

  const [isInputValid, setIsInputValid] = useState<{
    [key: string]: string;
  }>({
    usernameErrorMessage: "",
    passwordErrorMessage: "",
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({ ...userCredentials, username: event.target.value });
  };

  const handleUsernameBlur = () => {
    const isValidUsername = userCredentials.username.length > 1;

    if (!userCredentials.username.length) {
      setIsInputValid({
        ...isInputValid,
        usernameErrorMessage: "Username field is required",
      });
      return;
    }
    if (!isValidUsername) {
      setIsInputValid({
        ...isInputValid,
        usernameErrorMessage: "Username is incorrect",
      });
      return;
    }
    setIsInputValid({
      ...isInputValid,
      usernameErrorMessage: "",
    });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({ ...userCredentials, password: event.target.value });
  };

  const handlePasswordBlur = () => {
    const isValidPassword = userCredentials.password.length >= 6;
    if (!isValidPassword) {
      setIsInputValid({
        ...isInputValid,
        passwordErrorMessage: "Password field is required",
      });
    }
    setIsInputValid({
      ...isInputValid,
      passwordErrorMessage: "",
    });
  };

  async function handleAuth() {
    try {
      const data = await fetch("http://localhost:3001/users/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userCredentials.username,
          password: userCredentials.password,
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
      <FormControl isInvalid={!!isInputValid.usernameErrorMessage}>
        <FormLabel htmlFor="usernameInput">Username</FormLabel>
        <InputGroup>
          <InputRightElement pointerEvents="none">
            <MdOutlineAlternateEmail />
          </InputRightElement>
          <Input
            id="usernameInput"
            type="username"
            name="username"
            value={userCredentials.username}
            onChange={handleEmailChange}
            onBlur={handleUsernameBlur}
            placeholder="Enter username"
          />
        </InputGroup>
        <FormErrorMessage>{isInputValid.usernameErrorMessage}</FormErrorMessage>
      </FormControl>
      <PasswordInput
        passwordErrorMessage={isInputValid.passwordErrorMessage}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
      />
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
  const userCookie = getCookie("userId", { req, res });

  if (userCookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
