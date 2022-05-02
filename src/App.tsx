import React, { useState } from 'react';
import { ethers, ContractFactory } from "ethers";
import abi from "./smartContractInfo/abi.json"
import bytecode from "./smartContractInfo/bytecode.json"

import './App.css';

function App() {
  const [showListingForm, setShowListingForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<number>(0);
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

    setDeployArgs([title, description, endDate, goalAmount]);

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
          <input onChange={(e: any) => setEndDate(e.target.value)} placeholder='end date' />
          <input onChange={(e: any) => setGoalAmount(e.target.value)} placeholder='goal amount' />
          <button type='submit'>Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
