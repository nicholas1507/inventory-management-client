import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilEnvelopeOpen,
  cilFolder,
  cilHistory
} from '@coreui/icons'

import { 
  userDashboard, 
  getRequests 
} from '../api/api'

const UserDashboard = () => {
  const [data, setData] = useState({
    summary: {},
    alert: {},
    myRequests: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Fetch dashboard summary khusus user & 5 request terakhir milik user
        const [dashRes, reqRes] = await Promise.all([
          userDashboard(),
          getRequests({ page: 1, limit: 5 })
        ])
        
        setData({
          summary: dashRes.data?.summary || {},
          alert: dashRes.data?.alert || {},
          myRequests: reqRes.data || []
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load User Dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <CSpinner color="primary" variant="grow" className="mb-3" style={{ width: '3rem', height: '3rem' }}/>
          <h5 className="text-primary fw-bold">Loading Your Dashboard...</h5>
        </div>
      </div>
    )
  }

  if (error) return <CAlert color="danger">{error}</CAlert>

  const { summary, alert, myRequests } = data

  return (
    <div className="dashboard-wrapper">
      {/* SUMMARY & ALERTS CARDS */}
      <CRow className="mb-4 g-4">
        {/* 1. TOTAL CATALOG PRODUCTS */}
        <CCol sm={6} lg={3}>
          <CCard className="h-100 border-start border-start-4 border-start-primary shadow-sm">
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Available Products</div>
                <div className="fs-3 fw-bold text-primary">{summary.totalProducts || 0}</div>
                <div className="small text-body-secondary mt-1">Total items in catalog</div>
              </div>
              <CIcon icon={cilFolder} size="xl" className="text-primary opacity-25" />
            </CCardBody>
          </CCard>
        </CCol>
        
        {/* 2. TOTAL USER REQUESTS */}
        <CCol sm={6} lg={3}>
          <CCard className="h-100 border-start border-start-4 border-start-info shadow-sm">
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Total Requests</div>
                <div className="fs-3 fw-bold text-info">{summary.totalRequests || 0}</div>
                <div className="small text-body-secondary mt-1">Submitted requests</div>
              </div>
              <CIcon icon={cilEnvelopeOpen} size="xl" className="text-info opacity-25" />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 3. MY PENDING REQUESTS */}
        <CCol sm={6} lg={3}>
          <CCard className={`h-100 border-start border-start-4 shadow-sm ${alert.myPendingRequests > 0 ? 'border-start-warning' : 'border-start-secondary'}`}>
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Pending Approval</div>
                <div className="fs-3 fw-bold text-warning">{alert.myPendingRequests || 0}</div>
                <div className="small text-body-secondary mt-1">Waiting for Admin</div>
              </div>
              <CIcon icon={cilHistory} size="xl" className="text-warning opacity-50" />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 4. LOW STOCK ALERT (INFORMATIONAL) */}
        <CCol sm={6} lg={3}>
          <CCard className={`h-100 border-start border-start-4 shadow-sm ${alert.lowStockProducts > 0 ? 'border-start-danger' : 'border-start-success'}`}>
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Low Stock Items</div>
                <div className={`fs-3 fw-bold ${alert.lowStockProducts > 0 ? 'text-danger' : 'text-success'}`}>
                  {alert.lowStockProducts || 0}
                </div>
                <div className="small text-body-secondary mt-1">Items running low</div>
              </div>
              {alert.lowStockProducts > 0 && (
                <CIcon icon={cilWarning} size="xl" className="text-danger opacity-50" />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* RECENT USER REQUESTS TABLE */}
      <CRow className="g-4">
        <CCol xs={12}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <CIcon icon={cilEnvelopeOpen} className="me-2 text-primary" />
                <h6 className="fw-bold mb-0">My Recent Requests</h6>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable align="middle" hover responsive className="mb-0 border-top">
                <CTableBody>
                  {myRequests.length > 0 ? myRequests.map((req, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell className="ps-4 py-3">
                        <div className="fw-semibold">Request #{req.id || i + 1}</div>
                        <div className="small text-body-secondary">
                          {req.requestItems?.length || 0} Items requested
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-end pe-4">
                        <CBadge 
                          color={
                            req.status === 'APPROVED' || req.status === 'Approved' ? 'success' : 
                            req.status === 'REJECTED' || req.status === 'Rejected' ? 'danger' : 'warning'
                          }
                          className="mb-1"
                        >
                          {req.status}
                        </CBadge>
                        <div className="small text-body-secondary">
                          {new Date(req.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )) : (
                    <CTableRow>
                      <CTableDataCell colSpan="2" className="text-center py-4 text-muted">
                        You haven't submitted any stock requests yet.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default UserDashboard