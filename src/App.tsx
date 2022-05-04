import React, { useState } from 'react';
import { ethers, ContractFactory } from "ethers";
import abi from "./smartContractInfo/abi.json"
import bytecode from "./smartContractInfo/bytecode.json"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  const [showListingForm, setShowListingForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [goalAmount, setGoalAmount] = useState<number>(0);

  function handleListProject(): void {
    setShowListingForm(true);
  }

  function handleViewProjects(): void {

  }

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const factory = new ContractFactory(abi, bytecode, signer);
    let formattedEndDate = Math.floor(endDate.getTime() / 1000)

    // Make sure to pass constructor args here
    const contract = await factory.deploy(title, description, formattedEndDate, goalAmount);
  }

  return (
    <div className="App">
      <h1>Crowdfunding Dapp</h1>
      <button onClick={handleListProject}> List Project</button>
      <button onClick={handleViewProjects}>View Projects</button>

      {showListingForm && (
        <form onSubmit={handleSubmit}>
          <input onChange={(e: any) => setTitle(e.target.value)} placeholder='title' />
          <input onChange={(e: any) => setDescription(e.target.value)} placeholder='description' />
          <DatePicker selected={endDate} onChange={(date: any) => setEndDate(date)} />
          <input onChange={(e: any) => setGoalAmount(e.target.value)} placeholder='goal amount' />
          <button type='submit'>Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
