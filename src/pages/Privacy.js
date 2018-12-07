import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ContentLimiter from '../components/ContentLimiter'
import Hero from '../components/Hero'

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	form: {
		padding: theme.spacing.unit * 5
	}
})

class Privacy extends Component {
	render() {
		const { classes } = this.props

		return (
			<Hero>
				<ContentLimiter>
					<Grid container justify="space-between">
						<Grid item>
							<Typography variant="h4">Privacy</Typography>
						</Grid>

						<Paper className={classes.form} component="form">
							<Typography>
								This privacy policy has been compiled to better serve those who
								are concerned with how their 'Personally Identifiable
								Information' (PII) is being used online. PII, as described in US
								privacy law and information security, is information that can be
								used on its own or with other information to identify, contact,
								or locate a single person, or to identify an individual in
								context. Please read our privacy policy carefully to get a clear
								understanding of how we collect, use, protect or otherwise
								handle your Personally Identifiable Information in accordance
								with our website.
							</Typography>

							<Typography>
								What personal information do we collect from the people that
								visit our blog, website or app?
							</Typography>

							<Typography>
								When ordering or registering on our site, as appropriate, you
								may be asked to enter your name, email address or other details
								to help you with your experience.
							</Typography>

							<Typography>When do we collect information?</Typography>

							<Typography>
								We collect information from you when you register on our site or
								enter information on our site.
							</Typography>

							<Typography>How do we use your information? </Typography>

							<Typography>
								We may use the information we collect from you when you
								register, make a purchase, sign up for our newsletter, respond
								to a survey or marketing communication, surf the website, or use
								certain other site features in the following ways:
							</Typography>

							<Typography>
								- To personalize your experience and to allow us to deliver the
								type of content and product offerings in which you are most
								interested.
							</Typography>

							<Typography>
								- To send periodic emails regarding your order or other products
								and services.
							</Typography>

							<Typography>How do we protect your information?</Typography>

							<Typography>
								We do not use vulnerability scanning and/or scanning to PCI
								standards.
							</Typography>

							<Typography>
								We only provide articles and information. We never ask for
								credit card numbers.
							</Typography>

							<Typography>We do not use Malware Scanning.</Typography>

							<Typography>
								Your personal information is contained behind secured networks
								and is only accessible by a limited number of persons who have
								special access rights to such systems, and are required to keep
								the information confidential. In addition, all sensitive/credit
								information you supply is encrypted via Secure Socket Layer
								(SSL) technology.
							</Typography>

							<Typography>
								We implement a variety of security measures when a user enters,
								submits, or accesses their information to maintain the safety of
								your personal information.
							</Typography>

							<Typography>
								All transactions are processed through a gateway provider and
								are not stored or processed on our servers.
							</Typography>

							<Typography>Do we use 'cookies'?</Typography>

							<Typography>
								We do not use cookies for tracking purposes{' '}
							</Typography>

							<Typography>
								You can choose to have your computer warn you each time a cookie
								is being sent, or you can choose to turn off all cookies. You do
								this through your browser settings. Since browser is a little
								different, look at your browser's Help Menu to learn the correct
								way to modify your cookies.
							</Typography>

							<Typography>
								If you turn cookies off, Some of the features that make your
								site experience more efficient may not function properly.that
								make your site experience more efficient and may not function
								properly.
							</Typography>

							<Typography>Third-party disclosure</Typography>

							<Typography>
								We do not sell, trade, or otherwise transfer to outside parties
								your Personally Identifiable Information.
							</Typography>

							<Typography>Third-party links</Typography>

							<Typography>
								We do not include or offer third-party products or services on
								our website.
							</Typography>

							<Typography>Google</Typography>

							<Typography>
								Google's advertising requirements can be summed up by Google's
								Advertising Principles. They are put in place to provide a
								positive experience for users.
								https://support.google.com/adwordspolicy/answer/1316548?hl=en
							</Typography>

							<Typography>
								We use Google AdSense Advertising on our website.
							</Typography>

							<Typography>
								Google, as a third-party vendor, uses cookies to serve ads on
								our site. Google's use of the DART cookie enables it to serve
								ads to our users based on previous visits to our site and other
								sites on the Internet. Users may opt-out of the use of the DART
								cookie by visiting the Google Ad and Content Network privacy
								policy.
							</Typography>

							<Typography>We have implemented the following:</Typography>

							<Typography>
								We, along with third-party vendors such as Google use
								first-party cookies (such as the Google Analytics cookies) and
								third-party cookies (such as the DoubleClick cookie) or other
								third-party identifiers together to compile data regarding user
								interactions with ad impressions and other ad service functions
								as they relate to our website.
							</Typography>

							<Typography>Opting out:</Typography>

							<Typography>
								Users can set preferences for how Google advertises to you using
								the Google Ad Settings page. Alternatively, you can opt out by
								visiting the Network Advertising Initiative Opt Out page or by
								using the Google Analytics Opt Out Browser add on.
							</Typography>

							<Typography variant="h4">
								California Online Privacy Protection Act
							</Typography>

							<Typography>
								CalOPPA is the first state law in the nation to require
								commercial websites and online services to post a privacy
								policy. The law's reach stretches well beyond California to
								require any person or company in the United States (and
								conceivably the world) that operates websites collecting
								Personally Identifiable Information from California consumers to
								post a conspicuous privacy policy on its website stating exactly
								the information being collected and those individuals or
								companies with whom it is being shared. - See more at:
								http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf
							</Typography>

							<Typography>
								According to CalOPPA, we agree to the following:
							</Typography>

							<Typography>Users can visit our site anonymously.</Typography>

							<Typography>
								Once this privacy policy is created, we will add a link to it on
								our home page or as a minimum, on the first significant page
								after entering our website.
							</Typography>

							<Typography>
								Our Privacy Policy link includes the word 'Privacy' and can
								easily be found on the page specified above.
							</Typography>

							<Typography>
								You will be notified of any Privacy Policy changes:
							</Typography>

							<Typography>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - On our Privacy Policy Page
							</Typography>

							<Typography>Can change your personal information:</Typography>

							<Typography>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - By logging in to your account
							</Typography>

							<Typography>
								How does our site handle Do Not Track signals?
							</Typography>

							<Typography>
								We honor Do Not Track signals and Do Not Track, plant cookies,
								or use advertising when a Do Not Track (DNT) browser mechanism
								is in place.
							</Typography>

							<Typography>
								Does our site allow third-party behavioral tracking?
							</Typography>

							<Typography>
								It's also important to note that we do not allow third-party
								behavioral tracking
							</Typography>

							<Typography variant="h4">
								COPPA (Children Online Privacy Protection Act)
							</Typography>

							<Typography>
								When it comes to the collection of personal information from
								children under the age of 13 years old, the Children's Online
								Privacy Protection Act (COPPA) puts parents in control. The
								Federal Trade Commission, United States' consumer protection
								agency, enforces the COPPA Rule, which spells out what operators
								of websites and online services must do to protect children's
								privacy and safety online.
							</Typography>

							<Typography>
								We do not specifically market to children under the age of 13
								years old.
							</Typography>

							<Typography>
								Do we let third-parties, including ad networks or plug-ins
								collect PII from children under 13?
							</Typography>

							<Typography variant="h4">Fair Information Practices</Typography>

							<Typography>
								The Fair Information Practices Principles form the backbone of
								privacy law in the United States and the concepts they include
								have played a significant role in the development of data
								protection laws around the globe. Understanding the Fair
								Information Practice Principles and how they should be
								implemented is critical to comply with the various privacy laws
								that protect personal information.
							</Typography>

							<Typography>
								In order to be in line with Fair Information Practices we will
								take the following responsive action, should a data breach
								occur:
							</Typography>

							<Typography>We will notify you via email</Typography>

							<Typography>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Within 7 business days
							</Typography>

							<Typography>
								We also agree to the Individual Redress Principle which requires
								that individuals have the right to legally pursue enforceable
								rights against data collectors and processors who fail to adhere
								to the law. This principle requires not only that individuals
								have enforceable rights against data users, but also that
								individuals have recourse to courts or government agencies to
								investigate and/or prosecute non-compliance by data processors.
							</Typography>
						</Paper>
					</Grid>
				</ContentLimiter>
			</Hero>
		)
	}
}

export default withStyles(styles)(Privacy)
