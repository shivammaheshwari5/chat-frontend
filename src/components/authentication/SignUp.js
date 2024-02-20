import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../environment/apiconfig";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [confirmPass, setConfirmpass] = useState();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState();
  const toast = useToast();

  const navigate = useNavigate();
  const handleClick = () => {
    setShow(!show);
  };
  const fileUpload = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-anyone");
      data.append("cloud_name", "dnkzjdhja");
      fetch("https://api.cloudinary.com/v1_1/dnkzjdhja/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandle = async () => {
    setLoading(true);
    if (!name || !password || !email || !confirmPass) {
      toast({
        title: "Please Fill all The Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPass) {
      toast({
        title: "Password does'nt match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${base_url}/api/user`,
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          type={"text"}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          type={"text"}
        />
      </FormControl>
      <InputGroup>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
          />
        </FormControl>
        <InputRightElement top="32px" width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <FormControl id="confirmpass" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpass(e.target.value)}
            type={"text"}
          />
        </FormControl>
        <InputRightElement top="32px" width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormControl id="file" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          border="none"
          placeholder="No file chosen"
          onChange={(e) => fileUpload(e.target.files[0])}
          accept="image/*"
          type={"file"}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandle}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
