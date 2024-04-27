import React, { useState, useEffect } from 'react';
import { faker, fakerRU, fakerUK, fakerPL, fakerDE, fakerEN_AU, fakerDE_AT, fakerDE_CH } from '@faker-js/faker';
import { makeMistakes } from './helpers/helper.jsx';
import UserComponent from './components/UserComponent.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Button, Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('de');
  const [seedValue, setSeedValue] = useState(faker.seed());
  const [errorRate, setErrorRate] = useState(0);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const maxValue = 1000;
  const pageSize = 20;

  useEffect(() => {
    switch(selectedRegion) {
      case 'de':
        fakerDE.seed(seedValue);
        setUsers(generateUsers(fakerDE, pageSize));
        break;
      case 'ru':
        fakerRU.seed(seedValue);
        setUsers(generateUsers(fakerRU, pageSize));
        break;
      case 'en':
        fakerEN_AU.seed(seedValue);
        setUsers(generateUsers(fakerEN_AU, pageSize));
        break;
      default:
        break;
    }
  }, [seedValue, selectedRegion, errorRate]);

  const generateUser = (fakerRegion) => {
    if (errorRate === 0) {
      return {
        id: fakerRegion.database.mongodbObjectId(),
        name: fakerRegion.person.fullName(),
        city: fakerRegion.address.city(),
        address: fakerRegion.location.streetAddress(),
        phone: fakerRegion.phone.number(),
      };
    } else {
      return {
        id: fakerRegion.database.mongodbObjectId(),
        name: makeMistakes(fakerRegion.person.fullName(), selectedRegion, false, Number(errorRate)),
        city: makeMistakes(fakerRegion.address.city(), selectedRegion, false, Number(errorRate)),
        address: makeMistakes(fakerRegion.location.streetAddress(), selectedRegion, false, Number(errorRate)),
        phone: makeMistakes(fakerRegion.phone.number(), selectedRegion, true, Number(errorRate)),
      };
    }
  };

  const generateUsers = (region, count) => {
    return faker.helpers.multiple(() => generateUser(region), { count: count });
  };

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10 &&
      !isLoading
    ) {
      setIsLoading(true);
    }
  }

  useEffect(() => {
    const handleScrollEvent = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScrollEvent);

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      switch(selectedRegion) {
        case 'de':
          loadMoreContent(fakerDE);
          break;
        case 'ru':
          loadMoreContent(fakerRU);
          break;
        case 'en':
          loadMoreContent(fakerUK);
          break;
        default:
          break;
      }
      setIsLoading(false);
    }
  }, [isLoading]);

  function loadMoreContent(region) {
    const newUsers = generateUsers(region, pageSize);
    setUsers(prevUsers => [...prevUsers, ...newUsers]);
  }

  return (
    <>
      <Container>
        <Form className='d-grid form mt-5'>
          <Row className='justify-content-start align-items-center'>
            <Col md={3}>
              <Form.Select aria-label="Default select example" className='my-3 mw-25 bg-secondary text-white' value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className='justify-content-start align-items-center'>
            <Col md={3}>
              <Form.Group controlId="formGridEmail">
                <Form.Control className='my-3' type="number" placeholder="Enter seed" min={0} value={seedValue} onChange={(e) => setSeedValue(Number(e.target.value))}/>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="secondary" onClick={() => setSeedValue(faker.seed())}>
                Random
              </Button>
            </Col>
          </Row>
          <Row className='justify-content-start align-items-center'>
            <Col md={3}>
              <Form.Range className='my-3' min={0} max={maxValue} step={1} value={errorRate} onChange={(e) => setErrorRate(e.target.value === '' ? 0 : parseInt(e.target.value)) } />
            </Col>
            <Col md={1}>
              <Form.Control className='my-3' placeholder="0" type='number' min={0} max={maxValue} step={1} value={errorRate} onChange={(e) => {setIsLoading(false); setErrorRate(e.target.value === '' ? 0 : parseInt(e.target.value))}}/>
            </Col>
          </Row>
        </Form>
        <Table bordered hover className="mt-5">
          <thead className=''>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>PhoneNumber</th>
            </tr>
          </thead>
          <tfoot>
            {users.map((user, index) => <UserComponent key={user.id} number={index + 1} id={user.id} name={user.name} address={user.address} phone={user.phone}/>)}
          </tfoot>
        </Table>
      </Container>
    </>
  );
}

export default App;
