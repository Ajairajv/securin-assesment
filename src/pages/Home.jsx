import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 
import db from '../firebase';

function Home() {
    const navigate = useNavigate();
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const itemsPerPageOptions = [10, 50, 100];

    useEffect(() => {
        fetchCVEData();
    }, [currentPage, itemsPerPage]);

    const handleRowClick = (id) => {
        navigate(`/cves/${id}`);
    };

    const fetchCVEData = async () => {
        try {
            const response = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setTotalItems(data.totalResults);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, data.vulnerabilities.length);
            const vulnerabilitiesToDisplay = data.vulnerabilities.slice(startIndex, endIndex);

            for (const vulnerability of vulnerabilitiesToDisplay) {
                const q = query(collection(db, 'cveData'), where('cve.id', '==', vulnerability.cve.id));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) await saveToFirestore(vulnerability);
                else {
                    querySnapshot.forEach(async (doc) => {
                        const docRef = doc.ref;
                        const existingData = doc.data();
                        if (existingData.cve.lastModified !== vulnerability.cve.lastModified) {
                            await docRef.update(vulnerability);
                            console.log('Document updated in Firestore:', vulnerability.cve.id);
                        } else {
                            console.log('Document already exists in Firestore:', vulnerability.cve.id);
                        }
                    });
                }
            }
            setVulnerabilities(vulnerabilitiesToDisplay);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const saveToFirestore = async (data) => {
        try {
            const q = query(collection(db, 'cveData'), where('cve.id', '==', data.cve.id));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                const docRef = await addDoc(collection(db, 'cveData'), data);
                console.log('Document written with ID: ', docRef.id);
            } else {
                console.log('Document already exists in Firestore.');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const displayCVETable = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        return (
            <tbody>
                {vulnerabilities.slice(startIndex, endIndex).map((vulnerability, index) => (
                    <tr key={index} onClick={() => handleRowClick(vulnerability.cve.id)} style={{ cursor: 'pointer' }}>
                        <td>{vulnerability.cve.id}</td>
                        <td>{vulnerability.cve.sourceIdentifier}</td>
                        <td>{new Date(vulnerability.cve.published).toLocaleDateString()}</td>
                        <td>{new Date(vulnerability.cve.lastModified).toLocaleDateString()}</td>
                        <td>{vulnerability.cve.vulnStatus}</td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    // const totalPages = Math.ceil(totalItems / itemsPerPage);
    // const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    // // const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    return (
        <div id="cveData" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>CVE LIST</h1>
            <p>Total Records: {totalItems}</p>

            <table>
                <thead>
                    <tr>
                        <th>CVE ID</th>
                        <th>Identifier</th>
                        <th>Published Date</th>
                        <th>Last Modified</th>
                        <th>Status</th>
                    </tr>
                </thead>
                {displayCVETable()}
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div className="items-per-page">
                    Results Per Page:
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Home;
