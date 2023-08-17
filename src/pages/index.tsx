import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Text,
  StackDivider,
  Box,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";

export default function Home({ userDetails }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);

  const [isTransactionLoading, setIsTransactionLoading] = useState(false);

  const [transactionData, setTransactionData] = useState({
    receiver_username: "",
    amount: 0,
  });

  const onReceiverUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionData({
      ...transactionData,
      receiver_username: event.target.value,
    });
  };

  const onTransactionAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionData({ ...transactionData, amount: +event.target.value });
  };

  const [isTransactionDataValid, setIsTransactionDataValid] = useState<{
    [key: string]: string;
  }>({
    receiverUsernameErrorMessage: "",
    transactionAmountErrorMessage: "",
  });

  const handleReceiverUsernameBlur = () => {
    if (!transactionData.receiver_username.length) {
      setIsTransactionDataValid({
        ...isTransactionDataValid,
        receiverUsernameErrorMessage: "Username is required",
      });
      return;
    }
    setIsTransactionDataValid({
      ...isTransactionDataValid,
      receiverUsernameErrorMessage: "",
    });
  };

  const handleTransactionAmountBlur = () => {
    if (transactionData.amount <= 0) {
      setIsTransactionDataValid({
        ...isTransactionDataValid,
        transactionAmountErrorMessage: "Amount should not be empty or zero",
      });
      return;
    }
    setIsTransactionDataValid({
      ...isTransactionDataValid,
      transactionAmountErrorMessage: "",
    });
  };

  async function sendFunds() {
    if (
      !transactionData.receiver_username.length ||
      transactionData.amount === 0
    )
      return;

    setIsTransactionLoading(true);

    try {
      const data = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
        }),
      });

      const response = await data.json();

      alert(response.message)
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setIsTransactionLoading(false);
    }
  }

  return (
    <>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        <Box>
          <Text as="b">Username:</Text>
          <Text>{userDetails.username}</Text>
        </Box>
        <Box>
          <Text as="b">Balance:</Text>
          <Text>{userDetails.balance}</Text>
        </Box>
      </VStack>
      <Button
        mb={3}
        loadingText="Loading"
        colorScheme="teal"
        variant="outline"
        spinnerPlacement="start"
        onClick={onOpen}
      >
        Send funds
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl
              isInvalid={!!isTransactionDataValid.receiverUsernameErrorMessage}
            >
              <FormLabel>Receiver username</FormLabel>
              <Input
                onChange={onReceiverUsernameChange}
                ref={initialRef}
                onBlur={handleReceiverUsernameBlur}
              />
              <FormErrorMessage>
                {isTransactionDataValid.receiverUsernameErrorMessage}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={!!isTransactionDataValid.transactionAmountErrorMessage}
            >
              <FormLabel>Amount</FormLabel>
              <NumberInput defaultValue={0} precision={2}>
                <NumberInputField
                  onChange={onTransactionAmountChange}
                  onBlur={handleTransactionAmountBlur}
                />
              </NumberInput>
              <FormErrorMessage>
                {isTransactionDataValid.transactionAmountErrorMessage}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={sendFunds}
              colorScheme="blue"
              mr={3}
              isLoading={isTransactionLoading}
              isDisabled={
                !transactionData.receiver_username.length ||
                transactionData.amount === 0 ||
                isTransactionDataValid.receiverUsernameErrorMessage.length ||
                isTransactionDataValid.transactionAmountErrorMessage.length
              }
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie("userId", { req, res });

  if (userId == null) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const headers = req.headers.cookie
    ? { cookie: req.headers.cookie }
    : undefined;

  const data = await fetch(`http://localhost:3001/users/${userId}`, {
    headers,
  });

  if (data.status === 401) {
    res.setHeader("Set-Cookie", "userId=; Max-Age=0");

    return {
      redirect: {
        destination: "/login/",
        permanent: false,
      },
    };
  }

  const userDetails = await data.json();

  return { props: { userDetails } };
};
