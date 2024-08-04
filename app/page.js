'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, query } from 'firebase/firestore';
//im
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(''); // Added for quantity
  const [searchTerm, setSearchTerm] = useState('');
  // new added
  const [error, setError] = useState('');

   // State for image upload
   const [image, setImage] = useState(null);
   const [imageUrl, setImageUrl] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, qty) => {
    // if (!item.trim()|| !quantity.trim()) return; //new added
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    const parsedQty = parseInt(qty, 10); // Parse quantity as an integer

    if (docSnap.exists()) {
      const { quantity: existingQty } = docSnap.data();
      await setDoc(docRef, { quantity: existingQty + 1 });
    } else {
      await setDoc(docRef, { quantity: parsedQty });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    // if (!item.trim()) return; //new added
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };



  useEffect(() => {
    updateInventory();
  }, []);


  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false); new added
  const handleClose = () => {
    setOpen(false);
    setItemName(''); // Clear input when closing
    setQuantity(''); // Clear quantity when closing
    setError(''); // Clear error when closing
  };

  const handleAddItem = () => {
    if (!itemName.trim() && !quantity.trim()) {
      setError('Please enter item name and quantity');
    } else if (!itemName.trim()) {
      setError('Item name cannot be empty.');
    } else if (!quantity.trim()) {
      setError('Quantity cannot be empty.');
    } else if (parseInt(quantity, 10) <= 0) {
      setError('Quantity must be positive');
    }
    else {
      addItem(itemName, quantity);
      setItemName('');
      setQuantity('');
      handleClose();
    }
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item and the quantity</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              error={!!error}
            //helperText={error.includes('Item name') ? error : ''} 
            //new added for "item cannot be empty"
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={!!error}
              //helperText={error.includes('Quantity') ? error : ''}
              type="number"
            />
            <Button
              variant="outlined"
              onClick={handleAddItem}
            // {() => {
            //   addItem(itemName);
            //   setItemName('');
            //   handleClose()
            // }}
            >
              Add
            </Button>
          </Stack>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      <Box border="1px solid #000">
        <Box
          width="800px" height="100px"
          bgcolor="#ADB8E9" alignItems="center" justifyContent="center" display='flex' >
          <Typography variant="h2" color="f0ff00">
            Stash Stats
          </Typography>
        </Box>
        <Box
          width='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
          my={1}
        >
          <Button variant="contained"
          fullWidth
            onClick={() => {
              handleOpen();
            }}>
            Add New Item
          </Button>  
        </Box>
        <Box>
        <TextField
            variant="outlined"
            fullWidth
            label="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ my: 1}}
          />
        </Box>


        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor='white'
                padding={5}>
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name);
                    }}>Add</Button>
                </Stack>
                <Button variant="contained" onClick={() => {
                  removeItem(name);
                }}> Remove </Button>
              </Box>
            ))}

        </Stack>
      </Box>
    </Box>
  );
}
