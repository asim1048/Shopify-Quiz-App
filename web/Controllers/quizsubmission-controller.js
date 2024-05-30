import Quizsubmission from "../Models/quizsubmission.js";
import nodemailer from 'nodemailer'

import { Email, emailPassword } from "../host/index.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,
        pass: emailPassword,
    },
});
export const shopQuizSubmissions = async (req, res) => {
    try {
        const { shopID, quizID } = req.body;

        // Find all rescue bags for the specified restaurant
        const shopQuizSubmissions = await Quizsubmission.find({ shopID: shopID, quizID: quizID });

        return res.status(200).json({
            status: true,
            message: 'Shop quiz submission retrived successfully ',
            data: shopQuizSubmissions,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Something went wrong in the backend',
            error: error.message,
        });
    }
};

export const sendResultsEmail = async (request, response) => {
    try {
        const { name, email, products,host } = request.body;
        if (!email) {
            return response.status(400).json({
                status: false,
                message: "No Email entered",
            });
        }

        // Ensure image URLs are fully qualified
        // Ensure image URLs are fully qualified
    const productHTML = products.map(product => {
    

    return `
    <div style="display:inline-block;minHeight:100vh; max-width:195px;vertical-align:top;width:100%">
        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%;width:100%">
            <tbody>
                <tr>
                    <td align="center" style="padding:0px 10px">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:auto!important">
                                            <tbody>
                                                <tr>
                                                    <td align="center" width="175">
                                                        <h3 style="background:#7f1734;text-align:center;color:white!important;font-size:16px;padding:10px;width:98%;margin-top:10px" id="m_33783694536999936351">Best</h3>
                                                    </td>
                                                </tr>							
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:auto!important">
                                            <tbody>
                                                <tr>
                                                    <td align="center" width="175">
                                                        <img src="${product.image.src}" alt="Vacuum" width="175" style="margin:0;border:0;padding:0;width:100%;max-width:100%;display:block;height:auto" class="CToWUd a6T" data-bit="iit" tabindex="0">
                                                        <div class="a6S" dir="ltr" style="opacity: 0.01; left: 232.016px; top: 845.703px;">
                                                            <span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT">
                                                                <button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Download attachment " data-tooltip-enabled="true" data-tooltip-id="tt-c11" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc5OTkyODExNzUxNjg1ODcxMCJd; 43:WyJpbWFnZS9qcGVnIl0.">
                                                                    <span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span>
                                                                    <span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span>
                                                                    <span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true">
                                                                        <span class="bzc-ank" aria-hidden="true">
                                                                            <svg height="20" viewBox="0 -960 960 960" width="20" focusable="false" class=" aoH">
                                                                                <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                    <div class="VYBDae-JX-ano"></div>
                                                                </button>
                                                                <div class="ne2Ple-oshW8e-J9" id="tt-c11" role="tooltip" aria-hidden="true">Download</div>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>							
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10" style="line-height:10px;font-size:0">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color:#333333;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
                                        ${product.title}
                                    </td>		
                                </tr>
                                <tr>
                                    <td height="20" style="font-size:0;line-height:20px">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table align="center" bgcolor="#310a55" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="middle" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;padding:12px 15px">
                                                        <a href="${host}/products/${product?.handle}" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/product/airbelt-d4-premium/&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw08E1LkdlRPq0QMDlyQMGsh">SHOP NOW</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
}).join('');


        // Full HTML content
        // const htmlContent = `
        //     <div style="font-family: Arial, sans-serif; color: #333;">
        //         <p>Hello ${name},</p>
        //         <p>Thank you for using Vacuum Finder. Here are the results:</p>
        //         <div style="max-width:100%; overflow-y:hidden; display: flex; flex-direction: row; flex-wrap: wrap; background-color: white; justify-content: space-between; align-items: center; padding: 10px 25px;  ;">
        //         ${productHTML}
        //         </div>
        //         <p>If you didn't request this email, please ignore it.</p>
        //         <p>Best regards,<br>Vacuum Finder Team</p>
        //     </div>
        // `;
        const htmlContent = ` <div flex-direction: column; min-height: 100vh; background-color: black; margin: 0;'>
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
											<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
												
												<table align="center" bgcolor="#300854" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
													<tbody>	
														<tr>
															<td align="center">
																
																			<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																				<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px"> 
																					<tbody><tr>
																						<td height="15" style="line-height:15px;font-size:0"></td>
																					</tr>
																					<tr>
																						<td align="center" style="width:100%;max-width:100%;font-size:0">
																							
																										<div style="display:inline-block;max-width:150px;width:100%;vertical-align:top">
																											
																											<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;width:100%;max-width:100%">
																												<tbody><tr>
																													<td align="center">
																														<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:auto!important">
																															<tbody><tr>
																																
																																<td align="center" style="color:#ffffff">
																																	<a href="https://imperialhomeappliances.com" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw2AsCKQ4SeOi2vjmJ2TrLAm">
																																		<img src="https://ci3.googleusercontent.com/meips/ADKq_Nb_U7tdyUMKqn2d44N5sV7ppTjdlkV09qCd2_qXlEQx_8VKr6olj8KFLLVk71p4i6LtYs-mloQ96hlhCR2BkCljuxwQYZwXpqIiMjihOpksri_QZc9xZlMqyBwT-Zkl48toYD6SePG4mgfzSpQ=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/logo-150.png" alt="Imperial Home Appliances" width="150" height="50" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																																	</a>
																																</td>
																															</tr>
																														</tbody></table>
																													</td>
																												</tr>
																											</tbody></table>
																										</div>
																										
																										<div style="display:inline-block;width:100%;max-width:440px;vertical-align:top">
																											<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;width:100%;max-width:100%">
																												<tbody><tr>
																													<td align="center" style="font-size:0">		
																													
																														<div style="display:inline-block;width:100%;max-width:220px;vertical-align:top">
																															<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;width:100%;max-width:210px">
																																<tbody><tr>
																																	<td width="100%" style="font-size:0">&nbsp;</td>
																																</tr>
																															</tbody></table>
																														</div>
																													
																													<div style="display:inline-block;width:100%;max-width:210px;vertical-align:top">
																														<table align="right" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;width:100%;max-width:100%">
																															<tbody><tr>
																																<td align="center" style="font-size:0">
																																	
																																	<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;width:100%;max-width:100%">
																																		<tbody><tr>
																																			<td align="center">
																																				<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
																																					<tbody><tr>
																																						<td height="15" style="line-height:15px;font-size:0"></td>
																																					</tr>
																																					<tr>
																																						
																																						<td align="center" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;letter-spacing:1px">
																																						<a href="https://imperialhomeappliances.com/" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw2rBeqqVPQjl0H3kR5hRhiG">HOME</a></td>
																																						
																																						<td width="8">&nbsp;</td>
																																						
																																						<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;letter-spacing:1px">
																																						<a href="https://imperialhomeappliances.com/all-products/" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/all-products/&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw057YalNwGsfTyNnixdGmDx">SHOP</a></td>
																																						
																																						<td width="8">&nbsp;</td>
																																						
																																						<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;letter-spacing:1px">
																																						<a href="https://imperialhomeappliances.com/contact-us/" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/contact-us/&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw2o7vm0nxDfqe7AyMAQvyc1">CONTACT</a></td>
																																					</tr>
																																					<tr>
																																						<td height="15" style="line-height:15px;font-size:0"></td>
																																					</tr>
																																				</tbody></table>
																																			</td>
																																		</tr>
																																	</tbody></table>
																																</td>
																															</tr>
																														</tbody></table>
																													</div>
																													
																													</td>
																												</tr>
																											</tbody></table>
																										</div>
																										
																						</td>
																					</tr>
																					<tr>
																						<td height="15" style="line-height:15px;font-size:0">&nbsp;</td>
																					</tr>
																				</tbody></table>
																			</div>
																			
															</td>
														</tr>
													</tbody>	
												</table>
											</div>
										
					</td>
				</tr>					
			</tbody>	
		</table>
			

		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody><tr>
				<td align="center">
					
								<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
									
									<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
										<tbody><tr>
											
											<td align="center" width="800">

												
												

												<h1 style="font-family:Poppins,Helvetica Neue,Helvetica,sans-serif;font-size:35px;font-weight:400">Vacuum Finder Results</h1>
												<p style="font-family:Poppins-Regular,Helvetica Neue,Helvetica,sans-serif;font-size:16px;font-weight:400"><b>Hello ${name}, Based on your specific answers, Your Results are Below.</b></p>
												<div height="10" style="line-height:10px">&nbsp;</div>
												<p style="color:#000000;font-family:Poppins-Regular,Helvetica Neue,Helvetica,sans-serif;font-size:16px;font-weight:400;width:90%">"Best" is the TOP choice based on your specific answers, "Better" is a less expensive alternative, and "Good" represents a budget-friendly choice often less durable but satisfies your criteria.</p>

											</td>	
										</tr>
									</tbody></table>
								</div>
								
				</td>
			</tr>
		</tbody></table>	
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
											<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
												
												<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
													<tbody>	
														<tr>
															<td align="center">
																
																				<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																					<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
																						<tbody><tr>
																							<td height="60" style="line-height:60px">&nbsp;</td>
																						</tr>
																					

																						<tr>
																							<td align="center" style="font-size:0">
																								
                                                                                                ${productHTML}
																											
    

																											
																							</td>
																						</tr>
																						<tr>
																							<td height="45" style="font-size:0;line-height:45px">&nbsp;</td>
																						</tr>
																					</tbody></table>
																				</div>
																			
															</td>
														</tr>
													</tbody>	
												</table>
											</div>
										
					</td>
				</tr>					
			</tbody>	
		</table>
		
    		
		
		
	
		
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
									<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
										
										<table align="center" bgcolor="#666666" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
											<tbody><tr>
												<td align="center">
													
													<div style="margin:auto">
														<table align="center" border="0" bgcolor="#300854" cellpadding="0" cellspacing="0" width="100%" style="background:#300854">
															<tbody><tr>
																<td align="center" style="font-size:0">
																	
																				<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																					<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
																						<tbody><tr>
																							<td height="140" style="line-height:140px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>
																							<td align="center"> 
																								<table align="center" border="0" cellpadding="0" cellspacing="0" width="90%" style="max-width:90%!important">
																									<tbody><tr>	
																										
																										<td align="center" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:45px;line-height:55px;letter-spacing:1px">
																											GET FULL REFUND
																										</td>
																									</tr>
																									<tr>
																										<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																									</tr>
																									<tr>		
																										
																										<td align="center" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;line-height:24px;letter-spacing:1px">
																											If you don’t Love Your Vacuum, Send it back for a Full Refund
																										</td>
																									</tr>
																								</tbody></table>
																							</td>
																						</tr>
																						<tr>
																							<td height="20" style="font-size:0;line-height:20px">&nbsp;</td>
																						</tr>
																						<tr>
																							<td align="center">
																								
																								<table align="center" bgcolor="#ffffff" border="0" cellspacing="0" cellpadding="0">
																									<tbody><tr>
																										<td align="center" valign="middle" class="MsoNormal" style="color:#300854;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;padding:12px 15px">
																											<a href="https://imperialhomeappliances.com/" style="color:#300854;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/&amp;source=gmail&amp;ust=1716989304504000&amp;usg=AOvVaw2rBeqqVPQjl0H3kR5hRhiG">READ MORE</a>
																										</td>
																									</tr>
																								</tbody></table>
																							</td>
																						</tr>
																						<tr>
																							<td height="140" style="line-height:140px;font-size:0">&nbsp;</td>
																						</tr>
																					</tbody></table>
																				</div>
																				
																</td>
															</tr>
														</tbody></table>
													</div>
														
												</td>
											</tr>
										</tbody></table>
									</div>
									
					</td>
				</tr>
			</tbody>
		</table>
		
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
									<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
										
										<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
											<tbody>	
												<tr>
													<td align="center">
														
																	<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
																			<tbody>
																				<tr>
																					<td height="45" style="line-height:45px;font-size:0">&nbsp;</td>
																				</tr>
																				<tr>
																					<td align="center">
																						<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
																							<tbody><tr>
																								<td align="center" style="font-size:0">
																									
																												<div style="display:inline-block;max-width:195px;vertical-align:top;width:100%">
																													
																													<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;max-width:100%">
																														<tbody><tr>
																															<td align="center" style="padding:15px 10px">
																																<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																	<tbody><tr>
																																		<td align="center" width="64" valign="middle">
																																			<img src="https://ci3.googleusercontent.com/meips/ADKq_NbX_HvWUaYP6TtOKCDlf0JHwEesM0x9zzl4JW3ZF7rmbR3yYVbbFq9vG2wWZCXVAAsX38qYPrmYbXfBQX3C8Zo-Bxy8bWzfiaETS3FeyIU0IJXwyzvX8jELez-NbD1Dn6r05TpM8nQVyhA=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/icon1.png" alt="Low Price" width="64" height="64" style="color:#333333;margin:0;border:0;padding:0;display:block;height:auto" class="CToWUd" data-bit="iit">
																																		</td>
																																	</tr>	
																																	<tr>
																																		<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																	</tr>
																																	<tr>
																																		
																																		<td align="center" style="color:#333333;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																			<a href="#m_3378369453699993635_" style="color:#333333;text-decoration:none">
																																				Low Price
																																			</a>
																																		</td>
																																	</tr>
																																	<tr>
																																		<td height="5" style="line-height:5px;font-size:0">&nbsp;</td>
																																	</tr>
																																	<tr>	
																																		
																																		<td align="center" class="MsoNormal" style="color:#666666;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400">
																																			Our Low Price Guarantee ensures we're always cheaper than Amazon.
																																		</td>
																																	</tr>
																																</tbody></table>
																															</td>
																														</tr>
																													</tbody></table>
																												</div>
																												
																												<div style="display:inline-block;max-width:195px;vertical-align:top;width:100%">
																													
																													<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;max-width:100%">
																														<tbody><tr>
																															<td align="center" style="padding:15px 10px">
																																<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																	<tbody><tr>
																																		<td align="center" width="64" valign="middle">
																																			<img src="https://ci3.googleusercontent.com/meips/ADKq_NarwHiYqVPyfVNywo2EKZEAn4thHEXm-oIA9dDz3gZufCtSCGoEbLD0XxMs4SMQzvLpvjHr0Iz2v_lWymcR0B0PSsm00IBGeJ12a_zOhI0rSjhgCKbHZU6RrXzy32z7j5z9YnI7otR7tqw=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/icon2.png" alt="Free Shipping" width="64" height="64" style="color:#333333;margin:0;border:0;padding:0;display:block;height:auto" class="CToWUd" data-bit="iit">
																																		</td>
																																	</tr>	
																																	<tr>
																																		<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																	</tr>
																																	<tr>
																																		
																																		<td align="center" style="color:#333333;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																			<a href="#m_3378369453699993635_" style="color:#333333;text-decoration:none">
																																				Free Shipping
																																			</a>
																																		</td>
																																	</tr>
																																	<tr>
																																		<td height="5" style="line-height:5px;font-size:0">&nbsp;</td>
																																	</tr>
																																	<tr>	
																																		
																																		<td align="center" class="MsoNormal" style="color:#666666;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400">
																																			Imperial Home Appliances provides free shipping for orders over $35.
																																		</td>
																																	</tr>
																																</tbody></table>
																															</td>
																														</tr>
																													</tbody></table>
																												</div>
																												
																												<div style="display:inline-block;max-width:195px;vertical-align:top;width:100%">
																													
																													<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;max-width:100%">
																														<tbody><tr>
																															<td align="center" style="padding:15px 10px">
																																<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																	<tbody><tr>
																																		<td align="center" width="64" valign="middle">
																																			<img src="https://ci3.googleusercontent.com/meips/ADKq_Nb8xHt5NHLdH_cW36XATWFjQ_yrZtpPh0teW7BLWXURbm86kHEy7PCU3nMas5yoc8A2ODgcVMBjMH_D_LCZ_s-cxMmV9_ltJLHBl7j1ZE0BnMe6UpsN7g-kyq1kBDS0y7HtZtvfyln9ZGA=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/icon3.png" alt="Consultation" width="64" height="64" style="color:#333333;margin:0;border:0;padding:0;display:block;height:auto" class="CToWUd" data-bit="iit">
																																		</td>
																																	</tr>	
																																	<tr>
																																		<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																	</tr>
																																	<tr>
																																		
																																		<td align="center" style="color:#333333;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																			<a href="#m_3378369453699993635_" style="color:#333333;text-decoration:none">
																																				Consultation
																																			</a>
																																		</td>
																																	</tr>
																																	<tr>
																																		<td height="5" style="line-height:5px;font-size:0">&nbsp;</td>
																																	</tr>
																																	<tr>	
																																		
																																		<td align="center" class="MsoNormal" style="color:#666666;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400">
																																			If you're uncertain about your vacuum choice, we're here to assist. Call Us!
																																		</td>
																																	</tr>
																																</tbody></table>
																															</td>
																														</tr>
																													</tbody></table>
																												</div>
																												
																								</td>
																							</tr>
																						</tbody></table>
																					</td>
																				</tr>
																				<tr>
																					<td height="45" style="line-height:45px">&nbsp;</td>
																				</tr>
																			</tbody>	
																		</table>
																	</div>
																	
													</td>
												</tr>
											</tbody>	
										</table>
									</div>
									
					</td>
				</tr>					
			</tbody>	
		</table>
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
											<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
												
												<table align="center" bgcolor="#f6f6f6" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
													<tbody>	
														<tr>
															<td align="center">
																
																				<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																					<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
																						<tbody><tr>
																							<td height="60" style="line-height:60px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>
																							
																							<td align="center" style="color:#000000;font-family:Poppins,Helvetica Neue,Helvetica,sans-serif;font-size:35px;font-weight:600;line-height:45px;letter-spacing:1px">
																								Testimonial 
																							</td>
																						</tr>
																						<tr>
																							<td height="25" style="font-size:0;line-height:25px">&nbsp;</td>
																						</tr>
																						<tr>
																							<td>  
																								<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
																									<tbody><tr>
																										<td align="center" style="font-size:0">
																											
																														<div style="display:inline-block;max-width:140px;vertical-align:top;width:100%">
																																
																															<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%;width:100%">
																																<tbody><tr>
																																	<td align="center" style="padding:5px 10px"> 
																																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:auto!important;max-width:100%">
																																			<tbody><tr>
																																				<td align="left" width="120" style="color:#666666">
																																					<img src="https://ci3.googleusercontent.com/meips/ADKq_NaPubqmECCtGJ7qXQe_xb6Q5CDJCi8szhfyECpKU_iX8kajFW5dnMbrOgRJZq58zYs0L4k42Bb87omwsmOEugA8AX4SniUu232a_xTZlEaa2Uze0sCdX9L1FzJ_9W9wa0uRuTlh8goynO_Q=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/person.png" alt="Hannah" width="120" height="120" style="margin:0;border:0;padding:0;display:block;width:100%;max-width:100%;height:auto" class="CToWUd" data-bit="iit">
																																				</td>
																																			</tr>
																																		</tbody></table>
																																	</td>
																																</tr>
																															</tbody></table>
																														</div>
																														
																														<div style="display:inline-block;max-width:450px;vertical-align:top;width:100%">
																															
																															<table align="right" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%">	
																																<tbody><tr>
																																	<td style="padding:5px 10px">
																																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																			<tbody><tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#666666;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-style:italic;font-size:14px;font-weight:400;line-height:24px">
																																					"Came to Imperial Vacuum and bought some Kirby bags and some Lampe Berger scents. They had great service, super friendly and very knowledgeable. Definitely recommend stopping in and letting them educate and help you find the perfect vacuum or product."
																																				</td>
																																			</tr>
																																			<tr>
																																				<td height="10" style="line-height:10px;font-size:0">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#310a55;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:600;font-size:16px;line-height:26px;letter-spacing:1px">
																																					- Hannah Massie
																																				</td>
																																			</tr>
																																		</tbody></table>
																																	</td>
																																</tr>
																															</tbody></table>
																														</div>
																														
																										</td>
																									</tr>
																								</tbody></table>
																							</td>
																						</tr>
																						<tr>
																							<td height="55" style="line-height:55px;font-size:0">&nbsp;</td>
																						</tr>
																					</tbody></table>
																				</div>
																			
															</td>
														</tr>
													</tbody>	
												</table>
											</div>
										
					</td>
				</tr>					
			</tbody>	
		</table>
		
		
		
		<table align="center" bgcolor="#333333" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
				<tr>
					<td align="center">
						
									<div style="display:inline-block;width:100%;max-width:800px;vertical-align:top">
										
										<table align="center" bgcolor="#000000" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px">
											<tbody><tr>
												<td align="center">
													
													<div style="margin:auto">
														<table align="center" border="0" bgcolor="#300854" cellpadding="0" cellspacing="0" width="100%" style="background-color:#300854">
															<tbody><tr>
																<td align="center" style="font-size:0">
																	
																				<div style="display:inline-block;width:100%;max-width:600px;vertical-align:top">
																					<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
																						<tbody><tr>
																							<td height="130" style="line-height:130px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>		
																							<td align="center">
																								<table align="center" border="0" cellspacing="0" cellpadding="0" width="40%" style="width:auto!important">
																									<tbody><tr>
																										
																										<td align="left" valign="middle" width="32">
																											<a href="https://www.facebook.com/profile.php?id=100090909279210%20" style="color:#666666;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/profile.php?id%3D100090909279210%2520&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw2FhGTjr7jWX43TnUKPG1P8">
																												<img src="https://ci3.googleusercontent.com/meips/ADKq_NZ-THTEG0SAhhtrRGv-w4-KOJsEWP06oVnRM9s-b3nNlzvAdELA0YWLfnrtctEu9rY6YvKKiBMyzEypWHFg2RMlDZ9JS4Jd0dBd4qUYxklWCTmR24-qg1x5tl4-rBPdA3a7-gbDsck=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/fb.png" alt="Facebook" width="32" height="32" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																											</a>
																										</td>
																										<td width="20"></td>
																										<td align="left" valign="middle" width="32">
																											<a href="https://www.instagram.com/imperial.home.appliances/" style="color:#666666;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/imperial.home.appliances/&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw1HQDoo7ZfT7n6d6nQL9v_n">
																												<img src="https://ci3.googleusercontent.com/meips/ADKq_NZp8IpBrrwbT-RYNeIOM5gnF0IuIfzv4WD8LgTeOlgRRTLoOZwjL6wC4JNGwaQK5oB4AfXt_56rQvYCddP56vw9uFaUHX9sa4uT9yJF4NKERZRr7pAvf84ZMNjb3v3zhFJPa-fRULGj7yc=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/insta.png" alt="Instagram" width="32" height="32" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																											</a>
																										</td>
																										<td width="20"></td>
																										<td align="left" valign="middle" width="32">
																											<a href="mailto:support@imperialhomeappliances.com" style="color:#666666;text-decoration:none" target="_blank">
																												<img src="https://ci3.googleusercontent.com/meips/ADKq_Nbra0WyeiWoMrPeZapVJ0lKm39pT7M-iCJDPxqVPrJSyctarO5ap2WU8Erv0dnNGxJNnB7GG93grFAdFHrDbi9q9uqK7Q3ShHUV9v0_a4H6KznpxwQ-R3jZ8QGW7iWVLtXq86VXfXjBSG8=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/email.png" alt="Email" width="32" height="32" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																											</a>
																										</td>
																										<td width="20"></td>
																										<td align="left" valign="middle" width="32">
																											<a href="https://imperialhomeappliances.com/locations/" style="color:#666666;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/locations/&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw1ETfw_MBUht5Yv0BLArloU">
																												<img src="https://ci3.googleusercontent.com/meips/ADKq_NZptxsDtSagWbLT-bV8dYoToQsuAtjZpyi_65ei6R9omsb2zbtHCsojJLT2PIVrMcanoH200NcTT5qT1zCptorz4vaqgvQp4j808efp-pyeVxK7Re-RxDTvMJrebhODin_SY3F6FIwff2z6d64=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/location.png" alt="Location" width="32" height="32" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																											</a>
																										</td>
																										<td width="20"></td>
																										<td align="left" valign="middle" width="32">
																											<a href="https://www.youtube.com/@imperialhomeappliances" style="color:#666666;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.youtube.com/@imperialhomeappliances&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw2pQ0cDzSSNtJTUeFUxw--e">
																												<img src="https://ci3.googleusercontent.com/meips/ADKq_Na6Wy-i8qqJWRfSjsyl6Zl3sk2s5jx27gWYUIbkpGBeS0O7Bq3ZjIGmKEhSPDhmrax_qcc2P7iVh3jKvhIMAaSdWMcR4kpw3_BAewBuciGya8wrUYM9_lbnbKy9Db15Rasi0l1GBTc=s0-d-e1-ft#https://imperialhomeappliances.com/wp-content/plugins/vacuum-finder/images/yb.png" alt="YouTube" width="32" height="32" style="margin:0;border:0;padding:0;display:block" class="CToWUd" data-bit="iit">
																											</a>
																										</td>
																									</tr>
																								</tbody></table>
																							</td>
																						</tr>
																						<tr>
																							
																							<td height="30" style="border-bottom:1px solid #eeeeee;line-height:30px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>
																							<td height="15" style="line-height:15px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>
																							<td>
																								<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
																									<tbody><tr>
																										<td align="center" style="font-size:0">
																											
																														<div style="display:inline-block;max-width:195px;vertical-align:top;width:100%">
																																
																															<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%;width:100%">
																																<tbody><tr>
																																	<td align="center" style="padding:15px 10px"> 
																																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																			<tbody><tr>
																																				
																																					<td align="left" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																					Locations 
																																				</td>	
																																			</tr>
																																			<tr>
																																				<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:12px;line-height:24px;letter-spacing:1px">
																																					Amarillo,
																																					Bozeman &amp; Springfield
																																				</td>
																																			</tr>
																																		</tbody></table>
																																	</td>
																																</tr>
																															</tbody></table>
																														</div>	
																											
																														
																														<div style="display:inline-block;max-width:195px;vertical-align:top;width:100%">
																																
																															<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%;width:100%">
																																<tbody><tr>
																																	<td align="center" style="padding:15px 10px"> 
																																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%">
																																			<tbody><tr>
																																				
																																				<td align="left" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																					Website 
																																				</td>	
																																			</tr>
																																			<tr>
																																				<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:10px;font-weight:400;line-height:24px;letter-spacing:1px">
																																					<a href="https://imperialhomeappliances.com" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw0aROOQlmlI47cgA28CIFwV">imperialhomeappliances.com</a>
																																				</td>
																																			</tr>
																																			<tr>
																																				<td height="5" style="font-size:0;line-height:5px">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:24px;letter-spacing:1px">
																																					
																																				</td>
																																			</tr>
																																		</tbody></table>
																																	</td>
																																</tr>
																															</tbody></table>
																														</div>
																														
																														<div style="display:inline-block;max-width:196px;vertical-align:top;width:100%">
																																
																															<table align="right" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:100%;width:100%">
																																<tbody><tr>
																																	<td align="center" style="padding:15px 10px">
																																		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
																																			<tbody><tr>
																																				
																																				<td align="left" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-weight:400;font-size:20px;line-height:30px;letter-spacing:1px">
																																					Phone 
																																				</td>	
																																			</tr>
																																			<tr>
																																				<td height="10" style="font-size:0;line-height:10px">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:24px;letter-spacing:1px">
																																					<a href="tel:8889083056" style="color:#ffffff;text-decoration:none" target="_blank">(888) 908-3056</a>
																																				</td>
																																			</tr>
																																			<tr>
																																				<td height="5" style="font-size:0;line-height:5px">&nbsp;</td>
																																			</tr>
																																			<tr>
																																				
																																				<td align="left" class="MsoNormal" style="color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:24px;letter-spacing:1px">
																																					
																																				</td>
																																			</tr>
																																		</tbody></table>
																																	</td>
																																</tr>
																															</tbody></table>
																														</div>
																														
																										</td>
																									</tr>
																								</tbody></table>
																							</td>
																						</tr>
																						<tr>
																							
																							<td height="15" style="border-bottom:1px solid #eeeeee;line-height:15px;font-size:0">&nbsp;</td>
																						</tr>
																						<tr>
																							<td height="30" style="font-size:0;line-height:30px">&nbsp;</td>
																						</tr>
																						<tr>
																							<td align="center" class="MsoNormal" style="padding:0 10px;color:#ffffff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:12px;font-weight:400;line-height:22px;letter-spacing:1px">
																								<span>© All Rights Reserved </span> <span> | </span> <span><a href="https://imperialhomeappliances.com/" style="color:#ffffff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialhomeappliances.com/&amp;source=gmail&amp;ust=1716989304505000&amp;usg=AOvVaw19_vrZP6IGqYlMmecJGzwj">Imperial Home Appliances</a></span>
																							</td>
																						</tr>
																						<tr>
																							<td height="130" style="line-height:130px;font-size:0">&nbsp;</td>
																						</tr>
																					</tbody></table>
																				</div>
																				
																</td>
															</tr>
														</tbody></table>
													</div>
														
												</td>
											</tr>
										</tbody></table>
									</div>
									
					</td>
				</tr>
			</tbody>
		</table><div class="yj6qo"></div><div class="adL">	
		
	</div></div>`;

        // Email sending 
        const mailOptions = {
            from: Email,
            to: email,
            subject: "Vacuum Finder Results",
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return response.status(500).json({ message: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                response.json({
                    status: true,
                    message: 'Email sent successfully',
                });
            }
        });

    } catch (error) {
        console.error('Error sending email: ', error);
        response.status(500).json({
            status: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
};
