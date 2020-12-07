import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Dropdown, Form, Navbar } from 'react-bootstrap'
import ProfilePicture from './auth/elements/Avatar'
import useAxios from 'axios-hooks'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import ScrollAnimation from 'react-animate-on-scroll'
import { useAuth } from '../context/auth'
import Search from '../components/search'
import { useQuery } from 'react-query'
import { client } from '../utils/api-client'
import * as auth from '../auth-provider'

import logo from '../assets/images/logo.svg'
import logoWhite from '../assets/images/logo-white.svg'

const navbarBreakpoint = 100

const navbarPaths = ['/', '/over', '/stories/hque-redefined']

const navbarStyleDefault = {
  navbar: {
    bg: 'white',
    className: 'shadow-sm',
    variant: 'light',
  },
  logo: {
    src: logo,
  },
}

const navbarStyleTransparant = {
  navbar: {
    bg: 'transparent',
    className: 'bg-white-sm',
    variant: 'dark',
  },
  logo: {
    src: logoWhite,
  },
}

const navbarStyleToggle = {
  collapsed: 'fa fa-times',
  expanded: 'fa fa-bars',
}

export default props => {
  // const [{ data }] = useAxios('categories?parent_null=1&_sort=title:ASC', {
  //   useCache: true,
  // })
  // const [
  //   { data: dataMembers },
  // ] = useAxios('specialismes?parent_null=1&_sort=title:ASC', { useCache: true })
  //
  // const { data: me } = useQuery('me', async () =>
  //   client('users/me', { token: await auth.getToken() }).catch(error => {
  //     console.log('Could not get me as the user was not logged in', error)
  //   })
  // )

  const { logout, roles } = useAuth()

  const history = useHistory()
  const handleLogout = async () => {
    await logout()
    history.push('/')
  }

  // TODO: kevin add context to support this for each diff page.
  const { pathname } = useLocation()
  const supportNavbarTransparant = true
  const [navbarStyle, setNavbarStyle] = React.useState(
    navbarPaths.includes(pathname) ? navbarStyleTransparant : navbarStyleDefault
  )
  const [navbarCollapsed, setNavbarCollapsed] = React.useState(false)

  if (supportNavbarTransparant) {
    useScrollPosition(({ prevPos, currPos }) => {
      if (navbarPaths.includes(pathname)) {
        if (currPos.y * -1 > navbarBreakpoint) {
          setNavbarStyle(navbarStyleDefault)
        } else {
          setNavbarStyle(navbarStyleTransparant)
        }
      } else {
        setNavbarStyle(navbarStyleDefault)
      }
    })
  }

  function renderNotificationBadge() {
    // return (
    //   (!me.subscribedTopics ||
    //     Object.keys(me.subscribedTopics).some(
    //       key => me.subscribedTopics[key].length === 0
    //     )) && <span className="badge badge-warning notification-badge">1</span>
    // )

    return null
  }

  return (
    <header className="header">
      <Navbar
        {...navbarStyle.navbar}
        expand="lg"
        fixed="top"
        collapseOnSelect
        style={{
          transition: 'all 200ms ease-in',
        }}
        onToggle={collapsed => {
          setNavbarCollapsed(collapsed)
          if (collapsed || !navbarPaths.includes(pathname)) {
            setNavbarStyle(navbarStyleDefault)
          } else {
            if (window.pageYOffset > navbarBreakpoint) {
              setNavbarStyle(navbarStyleDefault)
            } else {
              setNavbarStyle(navbarStyleTransparant)
            }
          }
        }}
      >
        <Container fluid>
          <ScrollAnimation
            animateIn="animate__animated animate__fadeIn"
            animateOnce={true}
            offset={0}
            delay={1 * 50}
          >
            <Navbar.Brand>
              <Link to="/home">
                <img src={navbarStyle.logo.src} height="40" alt="HQUE" />
              </Link>
            </Navbar.Brand>
          </ScrollAnimation>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="border-0"
          >
            <i
              className={
                navbarCollapsed
                  ? navbarStyleToggle.collapsed
                  : navbarStyleToggle.expanded
              }
              style={{
                transition: 'all 200ms ease-in',
              }}
            ></i>
          </Navbar.Toggle>

          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="collapse navbar-collapse"
            bsPrefix="fs-navbar-collapse"
          >
            <Form
              className="mr-auto my-4 my-md-0 d-none"
              style={{ minWidth: '320px' }}
            >
              <ScrollAnimation
                animateIn="animate__animated animate__fadeIn"
                animateOnce={true}
                offset={0}
                delay={1000}
              >
                <Search />
              </ScrollAnimation>
            </Form>

            <ul className="navbar-nav pl-2 ml-auto">
              <Dropdown
                as="li"
                className="nav-item dropdown position-static"
                drop="down"
              >
                <Dropdown.Toggle className="nav-link" as="a">
                  Inspiratie
                </Dropdown.Toggle>
                <Dropdown.Menu
                  as="div"
                  className="megamenu p-0 py-lg-0 mt-0 mt-lg-n4 shadow-megamenu"
                  drop="down"
                >
                  <div className="row">
                    <div className="col-lg-9 px-0 mx-0 mx-lg-auto">
                      <div className="row p-3 pr-lg-0 pl-lg-5 pt-lg-5">
                        {/*  {!data
                          ? null
                          : data.map((parent, k) => (
                              <div className="col-lg-3" key={k}>
                                <LinkContainer
                                  to={`/collections/${parent.slug}`}
                                >
                                  <Dropdown.Item bsPrefix="hque">
                                    <h6 className="text-uppercase">
                                      {parent.title}
                                    </h6>
                                  </Dropdown.Item>
                                </LinkContainer>
                                {!parent.subs ? null : (
                                  <ul className="megamenu-list list-unstyled">
                                    {parent.subs
                                      .sort((a, b) =>
                                        a.title > b.title ? 1 : -1
                                      )
                                      .map((sub, k) => (
                                        <li
                                          className="megamenu-list-item"
                                          key={k}
                                        >
                                          <LinkContainer
                                            to={`/collections/${sub.slug}`}
                                          >
                                            <Dropdown.Item className="megamenu-list-link">
                                              {sub.title}
                                            </Dropdown.Item>
                                          </LinkContainer>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            ))} */}
                      </div>
                    </div>
                  </div>
                  <div className="row megamenu-services d-none d-lg-flex pl-lg-5 justify-content-center">
                    <div className="d-flex text-align-center">
                      <div className="megamenu-services-item">
                        <LinkContainer to="/collections">
                          <Dropdown.Item className="nav-link">
                            Alles bekijken
                          </Dropdown.Item>
                        </LinkContainer>
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                as="li"
                className="nav-item dropdown position-static"
                drop="down"
              >
                <Dropdown.Toggle className="nav-link" as="a">
                  Professionals
                </Dropdown.Toggle>
                <Dropdown.Menu
                  as="div"
                  className="megamenu p-0 py-lg-0 mt-0 mt-lg-n4 shadow"
                  drop="down"
                >
                  <div className="row">
                    <div className="col-lg-9 px-0 mx-0 mx-lg-auto">
                      <div className="row p-3 pr-lg-0 pl-lg-5 pt-lg-5">
                        {/* {!dataMembers
                          ? null
                          : dataMembers.map((parent, k) => (
                              <div className="col-lg-3" key={k}>
                                <LinkContainer to={`/members/${parent.slug}`}>
                                  <Dropdown.Item bsPrefix="hque">
                                    <h6 className="text-uppercase">
                                      {parent.title}
                                    </h6>
                                  </Dropdown.Item>
                                </LinkContainer>
                                {!parent.subs ? null : (
                                  <ul className="megamenu-list list-unstyled">
                                    {parent.subs
                                      .sort((a, b) =>
                                        a.title > b.title ? 1 : -1
                                      )
                                      .map((sub, k) => (
                                        <li
                                          className="megamenu-list-item"
                                          key={k}
                                        >
                                          <LinkContainer
                                            to={`/members/${sub.slug}`}
                                          >
                                            <Dropdown.Item className="megamenu-list-link">
                                              {sub.title}
                                            </Dropdown.Item>
                                          </LinkContainer>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            ))} */}
                      </div>
                    </div>
                  </div>
                  <div className="row megamenu-services d-none d-lg-flex pl-lg-5 justify-content-center">
                    <div className="d-flex text-align-center">
                      <div className="megamenu-services-item">
                        <LinkContainer to="/members">
                          <Dropdown.Item className="nav-link">
                            Alle professionals bekijken
                          </Dropdown.Item>
                        </LinkContainer>
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              <li className="nav-item">
                <LinkContainer to={`/over`}>
                  <Dropdown.Item className="nav-link">
                    <span>Over</span>
                  </Dropdown.Item>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to={`/lid-worden`}>
                  <Dropdown.Item className="nav-link">
                    <span>Lid worden</span>
                  </Dropdown.Item>
                </LinkContainer>
              </li>
              <li className="nav-item d-none">
                <Dropdown.Item className="nav-link">
                  <LinkContainer to={`/contact`}>
                    <span>Contact</span>
                  </LinkContainer>
                </Dropdown.Item>
              </li>

              <li className="nav-item">
                <LinkContainer to={`/login`}>
                  <Dropdown.Item className="nav-link">Inloggen</Dropdown.Item>
                </LinkContainer>
              </li>
            </ul>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
