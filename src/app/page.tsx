"use client";
import axios from 'axios';
import React, { useState } from 'react';

const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState('');
  const [cid, setCid] = useState('');
  const [transaction, setTransaction] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    try {
      if (file) {
        setIsMinting(true);
        const response = await axios.post('/api/upload', JSON.stringify({
          imageData: imageData,
          receiverAddress: receiverAddress,
          fileName:file.name,
          fileType:file.type,
        }), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;
        setCid(data.cid);
        setTransaction(data.transactionHash);
        clearFields();
      }
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsMinting(false);
    }
  };

  const retrieveFile = async (event:any) => {
    try {
      const data = event.target?.files?.[0];
      if (data) {
        const fileType = data.type;
        if (fileType.startsWith('image/')) {
          setFile(data);
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Data = event.target?.result;
          if (typeof base64Data === 'string') {
            setImageData(base64Data);
          }
        };
  
        reader.readAsDataURL(data);
      }else{
        alert('Please select an image file.');
      }
      }
      event.preventDefault();
    } catch (error) {
      console.error(error);
      alert('Retrieve File Does Not Work');
    }
  };
  

  const handleReceiverAddressChange = (event:any) => {
    setReceiverAddress(event.target.value);
  };

  const clearFields = () => {
    setReceiverAddress('');
    setImageData('')
  
    // Reset the file input value
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  

  return (
    <div className="flex flex-col h-screen md:flex-row bg-yellow-200">
      <div className="md:w-1/2 md:h-full h-1/3 bg-blue-200">
        <div className="flex items-center justify-center h-full">
          <h1 className="text-5xl text-center text-gray-800 animate-fade-in">NFT Minter</h1>
        </div>
      </div>
      <div className="md:w-1/2 md:h-full  p-10 bg-yellow-200">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            {cid && (
              <a href={`https://${cid}.ipfs.dweb.link`}>
                <img src={`https://${cid}.ipfs.dweb.link`} height="250px" width="250px" alt="NFT Preview" />
              </a>
            )}
          </div>
          <div>
            {transaction && (
              <a className="underline" href={`https://mumbai.polygonscan.com/tx/${transaction}`} target="_blank" rel="noopener noreferrer">
                Transaction Details
              </a>
            )}
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md mt-8">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Receiver Address"
                value={receiverAddress}
                onChange={handleReceiverAddressChange}
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                id="fileInput"
                onChange={retrieveFile}
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                disabled={isMinting}
              >
                {isMinting ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
