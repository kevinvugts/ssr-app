import React from 'react'

export default class ActiveCampaignForm extends React.Component {
  componentDidMount() {
    const script = document.createElement('script')

    script.src = 'https://hque.activehosted.com/f/embed.php?id=6'
    script.async = true

    document.body.appendChild(script)
  }

  render() {
    return <div className="_form_6" />
  }
}
