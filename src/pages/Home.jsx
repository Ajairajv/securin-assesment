import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';



function Home() {

   const navigate = useNavigate();
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
    const maxPagesToShow = 5; // Max pages to show in pagination
    const itemsPerPageOptions = [10, 50, 100]; // Options for items per page

    useEffect(() => {
        fetchCVEData();
    }, [currentPage, itemsPerPage]);


    const handleRowClick = (id) => {
      // Navigate to the details page for the clicked CVE
      navigate(`/cves/${id}`);
  };
    const fetchCVEData = async () => {
        try {
            const response = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTotalItems(data.totalResults);
            setVulnerabilities(data.vulnerabilities);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

   


    // table

    const displayCVETable = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        return (
            <tbody>
                {vulnerabilities.slice(startIndex, endIndex).map((vulnerability, index) => (
                 <tr key={index} onClick={() => handleRowClick(vulnerability.cve.id)}>
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


    // pages

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
      
    

    return (
        <div id="cveData" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>CVE LIST</h1>
            <p>Total Records: {totalItems}</p>

          {/* table */}
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
     

      {/* down */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div className="items-per-page">
                    Results Per Page:
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                    >
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="pagination-container">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-button"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {pagesToShow.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={
                                currentPage === page ? 'pagination-button active' : 'pagination-button'
                            }
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-button"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

     
        </div>
    );
}

export default Home;
