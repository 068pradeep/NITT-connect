import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useToast } from "@chakra-ui/toast";
import { useHistory } from "react-router";

const VerifyOTP = () => {
    const { id } = useParams();
    const [otp,setOtp]= useState("");
    const toast = useToast();
    const history = useHistory();
   ///console.log(otp);
    const sendOtp = async ()=>{
        try {
            console.log(otp);
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };
              const { data } = await axios.post(
                `/api/user/verification/${id}`,
                {
                  otp
                },
                config
              );
              if(!data.success){
                toast({
                    title: "Otp is not verify or incorrect ",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
              }
              else{
                toast({
                    title: "Otp is verify please login",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  history.push('/');

              }
        } catch (error) {
           console.log("erro while verifying otp",otp) ;
           toast({
            title: "Time is over please register again",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

        }
    }


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter OTP</h2>
      
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
          required
        />
        <button type="button" onClick={sendOtp} style={styles.button}>Submit</button>
      
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  heading: {
    fontSize: '20px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    outline: 'none',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#0056b3'
    }
  }
};

export default VerifyOTP;
