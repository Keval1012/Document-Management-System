import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from '../DmsComponent/List';
import AddForm from '../DmsComponent/AddForm';
import UpdateDocument from '../DmsComponent/UpdateDocument';

const MainRoutes = () => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<List />} />
                    <Route path='/dms/form' element={<AddForm />} />
                    <Route path='/updateDocument' element={<UpdateDocument />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default MainRoutes;