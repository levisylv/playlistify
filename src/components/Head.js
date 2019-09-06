import React, { Component, Fragment } from "react";
import '../css/Head.css';
import logo from '../Lotus.png';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import { LinkContainer } from "react-router-bootstrap";


    export default class Head extends React.Component {
        constructor(props) {
          super(props);
      
          this.toggle = this.toggle.bind(this);
          this.state = {
            isOpen: false
          };
        }
        toggle() {
          this.setState({
            isOpen: !this.state.isOpen
          });
        }
        handleLogout = event => {
          this.userHasAuthenticated(false);
        }
        render() {
          return (
            <div>
              <Navbar color="light" light expand="md">
                <img src={logo} className="Head-logo" alt="logo" />
                <NavbarBrand href="/">Playlistify</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink href="/components/">Components</NavLink>
                    </NavItem>
                    {this.state.isAuthenticated
                      ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                      : <Fragment>
                          <LinkContainer to="/login">
                            <NavItem>
                              <NavLink href="/login">Login</NavLink>
                            </NavItem>
                          </LinkContainer>
                          <LinkContainer to="/register">
                            <NavItem>
                                <NavLink href="/register">Register</NavLink>
                            </NavItem>
                          </LinkContainer>
                        </Fragment>
                    }
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Options
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          Option 1
                        </DropdownItem>
                        <DropdownItem>
                          Option 2
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          Reset
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                </Collapse>
              </Navbar>
            </div>
          );
        }
      }
  