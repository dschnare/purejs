<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<h1>
			<xsl:attribute name="id"><xsl:value-of select="root/symbol/@name" /></xsl:attribute>
			<xsl:value-of select="root/symbol/@name"/>
		</h1>
		<xsl:copy-of select="root/symbol/summary" />


		<div class="symbols">
			<xsl:apply-templates select="root/symbol/symbols" />
		</div>

		<div class="events">
			<xsl:apply-templates select="root/symbol/events" />
		</div>
	</xsl:template>
	<xsl:template match="symbol">
		<h3>
			<xsl:attribute name="id"><xsl:value-of select="@name" /></xsl:attribute>
			<xsl:value-of select="@name"/>
		</h3>
		<xsl:copy-of select="summary" />

		<div class="symbols">
			<xsl:apply-templates select="symbols" />
		</div>

		<div class="events">
			<xsl:apply-templates select="events" />
		</div>
	</xsl:template>
	<xsl:template match="event">
	</xsl:template>
</xsl:stylesheet>