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
  const [deployArgs, setDeployArgs] = useState<any[]>([]);

  function handleListProject(): void {
    setShowListingForm(true);
  }

  function handleViewProjects(): void {

  }

  async function handleSubmit(): Promise<void> {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const factory = new ContractFactory(abi, bytecode);
    let formattedEndDate = Math.floor(endDate.getTime() / 1000)

    setDeployArgs([title, description, formattedEndDate, goalAmount]);
    // If your contract requires constructor args, you can specify them here
    const contract = await factory.deploy(deployArgs);
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
