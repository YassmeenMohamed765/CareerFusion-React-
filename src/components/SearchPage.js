import React from 'react';
import { Container, Dropdown, Form, InputGroup, Button } from 'react-bootstrap';
import './SearchPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => {
  return (
    <Container>
      <div className="row">
        <div className="col-md-12">
          <div className="input-group" id="adv-search">
            <Form.Control type="text" placeholder="Search for Jobs" />
            <div className="input-group-btn">
              <div className="btn-group" role="group">
                <Dropdown className="dropdown-lg" drop="down">
                  <Dropdown.Toggle variant="default" id="dropdown-basic">
                    <span className="caret"></span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form>
                      <Form.Group>
                        <Form.Label>Filter by</Form.Label>
                        <Form.Control as="select">
                          <option value="0" selected>All Snippets</option>
                          <option value="1">Featured</option>
                          <option value="2">Most popular</option>
                          <option value="3">Top rated</option>
                          <option value="4">Most commented</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Contains the words</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        <FontAwesomeIcon icon={faSearch} /> Filter
                      </Button>
                    </Form>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="primary">
                  <FontAwesomeIcon icon={faSearch} /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SearchPage;
