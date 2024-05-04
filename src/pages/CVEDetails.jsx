import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


function CVEDetails() {
    const { id } = useParams();
    const [cveData, setCVEData] = useState(null);

    useEffect(() => {
        fetchCVEData();
    });

    const fetchCVEData = async () => {
        try {
            const response = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            const selectedCVE = data.vulnerabilities.find(vulnerability => vulnerability.cve.id === id);
            setCVEData(selectedCVE);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    if (!cveData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Display CVE details here */}
            <h2>{cveData.cve.id}</h2>
            <p>{cveData.cve.descriptions[0].value}</p>

            <h2> CVSS V2 Metrics</h2>
            
            <div className='first'>
            <p>Score: {cveData.cve.metrics.cvssMetricV2[0].cvssData.baseScore}</p>
            <p>Severity: {cveData.cve.metrics.cvssMetricV2[0].baseSeverity}</p>
            </div>
            <p>Vector String: {cveData.cve.metrics.cvssMetricV2[0].cvssData.vectorString}</p>
            
            <table>
                    <thead>
                        <tr>
                            <th>Access Vector</th>
                            <th>Access Complexity</th>
                            <th>Authentication</th>
                            <th>Confidentiality Impact</th>
                            <th>Integrity Impact</th>
                            <th>Availability Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.authentication}</td>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}</td>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
                            <td>{cveData.cve.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
                        </tr>
                    </tbody>
            </table>

          <h2>Scores:</h2>

          <p>exploitabilityScore: {cveData.cve.metrics.cvssMetricV2[0].exploitabilityScore}</p>
          <p>Imapct Score: {cveData.cve.metrics.cvssMetricV2[0].impactScore}</p>

          <h2>CPE:</h2>

            <table>
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Match Criteria ID</th>
                            <th>Vulnerable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cveData.cve.configurations.map((configuration, index) => (
                            configuration.nodes.map((node, nodeIndex) => (
                                node.cpeMatch.map((match, matchIndex) => (
                                    <tr key={matchIndex}>
                                        <td>{match.criteria}</td>
                                        <td>{match.matchCriteriaId}</td>
                                        <td>{match.vulnerable ? 'true' : 'false'}</td>
                                    </tr>
                                ))
                            ))
                        ))}
                    </tbody>
                </table>


        </div>
    );
}

export default CVEDetails;
